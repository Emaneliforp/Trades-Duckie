const { Client, GatewayIntentBits, Partials, Collection } = require('discord.js');
const { TOKEN } = require('./config.json');
const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildPresences,
		GatewayIntentBits.GuildMessageReactions,
		GatewayIntentBits.DirectMessages,
		GatewayIntentBits.MessageContent,
	],
	partials: [Partials.Channel, Partials.Message, Partials.User, Partials.GuildMember, Partials.Reaction],
});

const fs = require('fs');
const config = require('./config.json');

client.commands = new Collection();
client.aliases = new Collection();
client.slashCommands = new Collection();
client.buttons = new Collection();
client.prefix = config.prefix;

module.exports = client;
require('./database.js');

fs.readdirSync('./handlers').forEach((handler) => {
  require(`./handlers/${handler}`)(client);
});

client.login(TOKEN);