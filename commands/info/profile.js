const { EmbedBuilder } = require('discord.js');
module.exports = {
    name: 'profile',
    description: 'View a user profile.',
    cooldown: 0,
    aliases: [],
    userPerms: [],
    botPerms: [],
    run: async (client, message) => {
        const user = message.mentions.users.first() || message.author;
        const member = message.guild.members.cache.get(user.id);
        const point = await client.db.findOrCreatePoint(user.id);
        const rank = client.db.point.toJSON().sort((a, b) => b.points - a.points).findIndex((u) => u.userId === user.id) + 1;
        const roles = member.roles.cache.sort((a, b) => b.rawPosition - a.rawPosition).filter(r => r.id !== message.guild.id).map(r => r);

        const embed = new EmbedBuilder();
        embed.setColor(member.displayHexColor === '#000000' ? '#ffffff' : member.displayHexColor);
        embed.setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() });
        embed.addFields({ name: 'Points', value: `${point.points}`, inline: true });
        embed.addFields({ name: 'Rank', value: `${rank}`, inline: true });
        // embed.addFields({ name: 'Roles', value: member.roles.cache.filter(r => r.id !== message.guild.id).map(r => r).join(', ') || 'None', inline: false });
        // if more than 5 roles display first 5 then add "..." at the end
        embed.addFields({
            name: 'Roles',
            value: (roles.length > 4 ? roles.slice(0, 4).join(', ') + '...' : roles.join(', ')) || 'None',
            inline: false
        });          
        
        embed.addFields({ name: 'Created Account', value: `<t:${Math.floor(user.createdTimestamp / 1000)}:R>`, inline: true });
        embed.addFields({ name: 'Joined Server', value: `<t:${Math.floor(member.joinedTimestamp / 1000)}:R>`, inline: true });
        embed.setFooter({ text: message.guild.name, iconURL: message.guild.iconURL() });
        embed.setTimestamp();
        embed.setDescription('<a:duckFoot:764728615202979851><a:duckHead:764728615186595850>')
        message.channel.send({ embeds: [embed] });
    },
};