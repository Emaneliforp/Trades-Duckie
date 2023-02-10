const invSchema = require('../../schemas/inventorySchema');

const events = new Map;

const chances = [10, 10, 6, 2, 3];
const outcomes = ['none', 'fish', 'rare', 'exotic', 'legendary'];
const size = 31;

const nones = [
    'LMAO you found nothing. NICE!',
    'lol you suck, you found nothing',
    'You cast out your line and sadly didn\'t get a bite.',
    'Awh man, no fish wanted your rod today.',
];

const legendary = {
    'fish': {
        msg: 'Type `f\uFEFFi\uFEFFs\uFEFFh\uFEFF \uFEFFf\uFEFFi\uFEFFs\uFEFFh\uFEFF \uFEFFf\uFEFFi\uFEFFs\uFEFFh\uFEFF \uFEFFf\uFEFFi\uFEFFs\uFEFFh\uFEFFy\uFEFF`',
        key: 'fish fish fish fishy',
    },
    'camera': {
        msg: 'Type `g\uFEFFe\uFEFFt\uFEFF \uFEFFt\uFEFFh\uFEFFe\uFEFF \uFEFFc\uFEFFa\uFEFFm\uFEFFe\uFEFFr\uFEFFa\uFEFF \uFEFFr\uFEFFe\uFEFFa\uFEFFd\uFEFFy\uFEFF`',
        key: 'get the camera ready',
    },
};

const fishes = {
    'fish': {
        name: 'Common Fish',
        emoji: '<:common_fish:1073344957898834042>',
        size: 4,
    },
    'rare': {
        name: 'Rare Fish',
        emoji: '<:rare_fish:1073340855307489441>',
        size: 2,
    },
    'exotic': {
        name: 'Exotic Fish',
        emoji: '<:exotic:1073340852195315775>',
        size: 0,
    },
    'legendary': {
        name: 'Legendary Fish',
        emoji: '<:legendary:1073340850693738506>',
        size: 0,
    },
};


module.exports = {
	name: 'fish',
	description: 'fish fish fish',
	cooldown: 1000, // change to 15s
	userPerms: [],
	botPerms: [],
    keys: ['fish fish fish fishy', 'get the camera ready'],
    boss: async (msg) => {
        if (events.get(msg.author.id) != msg.content) return;
        events.delete(msg.author.id);

        let inv = await invSchema.findOne({ userId: msg.author.id, name: 'legendary' });
        if (!inv) {
            inv = new invSchema({ userId: msg.author.id, name: 'legendary' });
            await inv.save();
        }

        inv.quantity += 1;

        await inv.save();

        const embed = { description: `You caught a **${fishes['legendary'].emoji + ' ' + fishes['legendary'].name}**!` };
        await msg.reply({ embeds: [embed] });
    },
	run: async (client, msg) => {
        let rand = Math.floor(Math.random() * size);
        let res;
        for (let i = 0; i < chances.length; i++) {
            rand -= chances[i];
            if (rand <= 0) {
                res = outcomes[i];
                break;
            }
        }

        if (res == 'none') {
            const embed = { description: nones[Math.floor(Math.random() * nones.length)] };
            await msg.reply({ embeds: [embed] });
        }
        else if (res == 'legendary') {
            let event = Object.keys(legendary)[Math.floor(Math.random() * Object.keys(legendary).length)];
            event = legendary[event];
            events.set(msg.author.id, event.key);
            await msg.reply(event.msg);
            setTimeout(() => {
                if (events.get(msg.author.id)) {
                    events.delete(msg.author.id);
                    msg.reply('GG');
                }
            }, 10000);
        }
        else {
            const fish = fishes[res];
            let amount = Math.floor(Math.random() * fish.size) + 1;

            let inv = await invSchema.findOne({ userId: msg.author.id, name: res });
            if (!inv) {
                inv = new invSchema({ userId: msg.author.id, name: res });
                await inv.save();
            }

            inv.quantity += amount;

            await inv.save();

            if (amount == 1) amount = '';
            const embed = { description: `You cast out your line and brought back **${amount + ' ' + fish.emoji + ' ' + fish.name}**!` };
            await msg.reply({ embeds: [embed] });
        }
	},
};