const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'bal',
    aliases: ['balance', 'money'],
    description: 'Check your balance.',
    cooldown: 3000,
    userPerms: [],
    botPerms: [],
    run: async (client, message, args) => {
        const user = args[0] != null ? args[0].replace(/[<@!>]/g, '') : message.author.id;
        if (!client.users.cache.has(user)) return message.channel.send('Please specify a valid user.');
        const balance = await client.db.findOrCreateBalance(user);
        const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('Balance')
            .setDescription(`**${client.users.cache.get(user).tag}** has ${balance.amount} coins.`)
            .setFooter({ text: client.users.cache.get(user).tag, iconURL: client.users.cache.get(user).displayAvatarURL() });

        message.channel.send({ embeds: [embed] });
    },
};