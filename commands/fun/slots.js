const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'slots',
    description: 'Play slots.',
    cooldown: 0,
    userPerms: [],
    botPerms: [],
    run: async (client, message, args) => {
        const amount = client.utils.isValidAmount(args[0]);
        const balance = await client.db.findOrCreateBalance(message.author.id);

        if (balance.amount < amount) return message.channel.send('You do not have enough coins to bet.');
        if (!amount) return message.channel.send('Please specify an amount to bet.');
        if (amount < 1) return message.channel.send('Please specify a valid amount to bet.');

        const roll = module.exports.roll;
        const animals = module.exports.animals;
        const getAnimal = module.exports.getAnimal;

        const winRate = 100;
        const tripleWinRate = 30;

        const success = roll(winRate);

        if (success) {
            const triple = roll(tripleWinRate);
            const animal = getAnimal(animals);
            const multi = triple ? animal.triple : animal.double;

            balance.amount += amount + Math.ceil(Number(amount * (multi / 100)));
            balance.save();

            let number = 0;
            while (animals[number].name === animal.name) {
                number = Math.floor(Math.random() * animals.length);
            }
            const embed = new EmbedBuilder()
                .setColor('#77DD77')
                .setTitle('You won!')
                .setDescription(`${triple ? animal.emoji.repeat(3) : `${animal.emoji}${animals[number].emoji}${animal.emoji}`}\nMultiplier: \`${multi}\`%\nYou won \`${(amount + Math.ceil(Number(amount * (multi / 100)))).toLocaleString()}\` coins!`);
            message.channel.send({ embeds: [embed] });
        }
        else {
            balance.amount -= amount;
            balance.save();

            const numbers = [];
            while (numbers.length < 3) {
                const number = Math.floor(Math.random() * animals.length);
                if (!numbers.includes(number)) {
                    numbers.push(number);
                }
            }

            const embed = new EmbedBuilder()
                .setColor('#FF6961')
                .setTitle('You lost!')
                .setDescription(`${animals[numbers[0]].emoji} ${animals[numbers[1]].emoji} ${animals[numbers[2]].emoji}\nYou lost \`${amount}\` coins!`);
            message.channel.send({ embeds: [embed] });
        }
    },
    animals : [
        {
            name: 'duck',
            emoji: '🦆',
            double: 130,
            triple: 200,
            rate: 30,
        },
        {
            name: 'dragon',
            emoji: '🐉',
            double: 120,
            triple: 180,
            rate: 40,
        },
        {
            name: 'cat',
            emoji: '🐱',
            double: 110,
            triple: 160,
            rate: 50,
        },
        {
            name: 'rabbit',
            emoji: '🐇',
            double: 100,
            triple: 150,
            rate: 60,
        },
        {
            name: 'turtle',
            emoji: '🐢',
            double: 90,
            triple: 140,
            rate: 70,
        },
        {
            name: 'frog',
            emoji: '🐸',
            double: 80,
            triple: 130,
            rate: 80,
        },
        {
            name: 'bear',
            emoji: '🐻',
            double: 70,
            triple: 120,
            rate: 90,
        },
        {
            name: 'fox',
            emoji: '🦊',
            double: 60,
            triple: 110,
            rate: 100,
        },
    ],
    roll: (chance, min, max) => {
        if (chance) {
            return Math.floor(Math.random() * 100) < chance;
        }
        else {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }
    },
    getAnimal: (animals) => {
        const totalRate = animals.reduce((acc, animal) => acc + animal.rate, 0);
        const random = Math.floor(Math.random() * totalRate);
        let acc = 0;

        for (const animal of animals) {
            acc += animal.rate;
            if (random < acc) {
                return animal;
            }
        }
    },
};

// Path: commands/fun/slots.js
// const randomAnimal = module.exports.getAnimal(module.exports.animals);
// console.log(randomAnimal);
