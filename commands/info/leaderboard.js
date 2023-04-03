const Pagination = require('../../utils/pagination');
module.exports = {
    name: 'leaderboard',
    description: 'View points leaderboard.',
    cooldown: 0,
    aliases: ['lb'],
    userPerms: [],
    botPerms: [],
    run: async (client, message) => {
        const leaderboard = client.db.point;
        if (leaderboard.size < 1) {
            return message.channel.send('There are no users in the leaderboard.');
        }

        const embed = new Pagination(message, leaderboard.toJSON(), 10, `${message.guild.name}'s Points Leaderboard`, (data, index) => `${index}. ${message.guild.members.cache.get(data.userId)?.user?.username || data.userId} - \`${data.points.toLocaleString()}\` points\n`);

        return embed.send();
    },
};