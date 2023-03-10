const { EmbedBuilder } = require('discord.js');
const winrate = 0;
const breakeven = 0;

module.exports = {
    name: 'bet',
    description: 'Bet your money.',
    cooldown: 0,
    userPerms: [],
    botPerms: [],
    aliases: ['rolls', 'roll', 'gamble'],
    run: async (client, message, args) => {
        const amount = client.utils.isValidAmount(args[0]);
        const success = roll(winrate);
        const balance = await client.db.findOrCreateBalance(message.author.id);

        if (balance.amount < amount) return message.channel.send('You do not have enough coins to bet.');
        if (!amount) return message.channel.send('Please specify an amount to bet.');
        if (amount < 1) return message.channel.send('Please specify a valid amount to bet.');

        const userRoll = roll(null, 1, 15);

        if (success) {
            let botRoll = roll(null, userRoll == 15 ? userRoll - 1 : userRoll, 15);
            const multi = roll(null, 80, 125);

            if (botRoll == userRoll) {
				botRoll = botRoll + 1;
			}

            balance.amount += amount + Math.ceil(Number(amount * (multi / 100)));
            balance.save();

            const embed = new EmbedBuilder()
                    .setColor('#0099ff')
                    .setTitle('You won!')
                    .setDescription(`You rolled a ${userRoll} and the bot rolled a ${botRoll}. You won ${amount + Math.ceil(Number(amount * (multi / 100)))} coins!`);

            message.channel.send({ embeds: [embed] });
        }
        else {
            const tied = roll(breakeven);

            if (tied) {
                const embed = new EmbedBuilder()
                    .setColor('#0099ff')
                    .setTitle('You tied!')
                    .setDescription(`You rolled a ${userRoll} and the bot rolled a ${userRoll}. You did not lose any coins.`);

                message.channel.send({ embeds: [embed] });
            }
            else {
                // make the bot roll to always get lower than the userroll
                let botRoll = roll(null, userRoll == 15 ? userRoll - 1 : userRoll, 15);

                if (botRoll == userRoll) {
                    botRoll = botRoll + 1;
                }

                if (botRoll > userRoll) {
                    botRoll = botRoll - 1;
                }

                balance.amount -= Number(amount);
                balance.save();

                const embed = new EmbedBuilder()
                    .setColor('#0099ff')
                    .setTitle('You lost!')
                    .setDescription(`You rolled a ${userRoll} and the bot rolled a ${botRoll}. You lost ${amount} coins.`);

                message.channel.send({ embeds: [embed] });
            }
        }

        function roll(chance, min, max) {
            if (chance) {
                return Math.floor(Math.random() * 100) < chance;
            }
            else {
                return Math.floor(Math.random() * (max - min + 1)) + min;
            }
        }
    },
    roll(num, min = null, max = null) {
        if (!min && !max) return Math.floor(Math.random() * 100) <= num;
        if (min && max) return Math.floor(Math.random() * (max - min)) + min;
	},
};