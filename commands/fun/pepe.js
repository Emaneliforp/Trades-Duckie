module.exports = {
	name: 'pepe',
	description: '',
	cooldown: 3000, // change to 15s
	userPerms: [],
	botPerms: [],
    aliases: ['pp'],
    run: async (client, msg) => {
        const rand = Math.floor(Math.random() * 15);
        const embed = {
            title: 'peepee size machine',
            description: `${msg.author.username}'s penis\n8${'='.repeat(rand)}D`,
        };
        await msg.reply({ embeds: [embed] });
	},
};