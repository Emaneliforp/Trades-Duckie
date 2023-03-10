const { EmbedBuilder } = require('discord.js');
const winrate = 0.25;
const maxAmount = 5000;

module.exports = {
    name: 'coinflip',
    description: 'Rigged coinflip.',
    cooldown: 0,
    userPerms: [],
    botPerms: [],
    aliases: ['cf', 'coin', 'coin flip'],
    run: async (client, msg, args) => {
        const amount = client.utils.isValidAmount(args[0]);
        const balance = await client.db.findOrCreateBalance(msg.author.id);

        if (balance.amount < amount) return msg.channel.send('You do not have enough coins to coinflip.');
        if (!amount) return msg.channel.send('Please specify an amount to coinflip.');
        if (amount < 1) return msg.channel.send('Please specify a valid amount to coinflip.');
        if (amount > maxAmount) return msg.channel.send('Max coinflip amount is 5000 sp.');
        const coin = await msg.reply('<a:flip:764728615119618089>');
        setTimeout(() => {
            const win = (Math.random() < winrate);
            if (win) {
                balance.amount += amount + Math.ceil(Number(amount * 2));
                balance.save();
                coin.edit('<a:duckHead:764728615186595850>');
                const embed = {
                    title: 'You won!',
                    description: `You won ${amount + Math.ceil(Number(amount * 2))} sp!`,
                };
                msg.channel.send({ embeds: [embed] });
            }
            else {
                balance.amount -= amount;
                balance.save();
                coin.edit('<a:duckFoot:764728615202979851>');
                const embed = new EmbedBuilder()
                    .setColor('#0099ff')
                    .setTitle('You lost!')
                    .setDescription(`You lost ${amount} sp.`);
                msg.channel.send({ embeds: [embed] });
            }
          }, Math.floor(Math.random() * 3000));
    },
};