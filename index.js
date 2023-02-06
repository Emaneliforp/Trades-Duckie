const { Client, Events, Collection, GatewayIntentBits, REST, Routes } = require('discord.js');
const { token } = require('./config.json');
const fs = require('fs');
// const wait = require('node:util').promisify(setTimeout);

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection;
client.JSONCommands = [];
client.cooldowns = new Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.data.name, command);
	if (file == 'cooldown.js') continue;
	client.JSONCommands.push(command.data);
}

const rest = new REST({ version: '10' }).setToken(token);
(async () => {
	try {
		console.log(`Started refreshing ${client.JSONCommands.length} application (/) commands.`);
		const data = await rest.put(
			// Routes.applicationCommands('746487114375495831'),
			Routes.applicationGuildCommands('746487114375495831', '730613331542409227'),
			{ body: client.JSONCommands },
		);

		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	}
	catch (error) {
		console.error(error);
	}
})();

client.setup = require('./utils/setup.js');

client.once(Events.ClientReady, async () => {
	console.log('Ready!');
	await client.setup.init(client);
	// rest.delete(Routes.applicationCommand('746487114375495831', ''))
	// 	.then(() => console.log('Successfully deleted application command'))
	// 	.catch(console.error);
	// rest.put(Routes.applicationCommands(clientId), { body: [] })
	// 	.then(() => console.log('Successfully deleted all application commands.'))
	// 	.catch(console.error);
});

client.on(Events.InteractionCreate, async interaction => {
	if (interaction.isChatInputCommand()) {
		const command = client.commands.get(interaction.commandName);
		if (!command) return;

		try {
			const { cooldowns } = client;
			if (!cooldowns.has(command.data.name)) {
				cooldowns.set(command.data.name, new Collection());
			}
			const now = Date.now();
			const timestamps = cooldowns.get(command.data.name);
			const cooldownAmount = (command.data.cooldown.value || 3) * 1000;
			if (timestamps.has(interaction.user.id)) {
				const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;
				if (now < expirationTime) {
					const timeLeft = ((expirationTime - now) / 1000);
					return client.commands.get('cooldown').execute(interaction, client, timeLeft);
				}
			}
			timestamps.set(interaction.user.id, now);
			setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);
			await command.execute(interaction, client);
		}
		catch (error) {
			console.error(error);
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
	if (interaction.isStringSelectMenu()) {
		const command = client.commands.get(interaction.customId.split(' ')[0]);
		if (!command) return;
		try {
			await command.select(interaction, client);
		}
		catch (error) {
			console.error(error);
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
	// if (interaction.isButton()) {
	// 	if (interaction.customId == 'verify') {
	// 		await wait(2000);
	// 		return client.commands.get('verify').verify(interaction, client);
	// 	}
	// }
});

client.login(token);
module.exports = { client };