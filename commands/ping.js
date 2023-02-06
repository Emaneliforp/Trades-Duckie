module.exports = {
	data:  {
		name: 'ping',
		description: 'Pong!',
		help: 'Pong! 🏓',
		emoji: '🔖',
		cooldown: { text: '`3s`', value: 3 },
		footer: 'usage syntax: [required] <optional>',
		options: [
			{
				name: 'user',
				description: 'user to be pong',
				type: 6,
				required: true,
			},
		],
	},
	async execute(interaction, client) {
		const user = interaction.options.getUser('user');
		await client.db.setData('test', 'helloworld');
		const exampleEmbed = {
			description: `\`${Date.now() - interaction.createdTimestamp}ms 🏓\` <@!${user.id}>`,
			// react: '841793839294578718',
		};
		return client.embed(interaction, exampleEmbed);
	},
};