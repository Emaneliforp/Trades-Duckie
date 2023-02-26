const events = new Map;

const chances = [8, 8, 8, 6, 6, 3, 2];
const outcomes = ['none', 'duck', 'skunk', 'rabbit', 'boar', 'deer', 'dragon'];
const size = 41;

const nones = [
    'You went hunting in the woods and brought back NOTHING! 😆',
    'LMAO you are terrible, you found nothing to hunt',
];

const eventMsg = 'Holy fucking shit god forbid you find something innocent like a duck, ITS A DRAGON! Type the phrase below in the next 10 seconds or you\'re toast!\n';
const legendary = {
    'eating': {
        msg: 'Type `p﻿l﻿s﻿ ﻿n﻿o﻿ ﻿e﻿a﻿t﻿i﻿n﻿g﻿ ﻿m﻿e﻿`',
        key: 'pls no eating me',
    },
    'holy': {
        msg: 'Type `h﻿o﻿l﻿y﻿ ﻿s﻿h﻿i﻿t﻿ ﻿a﻿ ﻿d﻿r﻿a﻿g﻿o﻿n﻿`',
        key: 'holy shit a dragon',
    },
    'toothers': {
        msg: 'Type `w﻿o﻿a﻿h﻿ ﻿t﻿h﻿o﻿s﻿e﻿ ﻿a﻿r﻿e﻿ ﻿s﻿o﻿m﻿e﻿ ﻿t﻿o﻿o﻿t﻿h﻿e﻿r﻿s`',
        key: 'woah those are some toothers',
    },
    'frick': {
        msg: 'Type `o﻿h﻿ ﻿f﻿r﻿i﻿c﻿k﻿ ﻿a﻿ ﻿d﻿r﻿a﻿g﻿o﻿n﻿`',
        key: 'oh frick a dragon',
    },
    'momma': {
        msg: 'Type `d﻿r﻿a﻿g﻿o﻿n﻿ ﻿t﻿h﻿e﻿s﻿e﻿ ﻿n﻿u﻿t﻿s﻿ ﻿o﻿n﻿ ﻿y﻿o﻿u﻿r﻿ ﻿m﻿o﻿m﻿m﻿a﻿`',
        key: 'dragon these nuts on your momma',
    },
    'rawr': {
        msg: 'Type `d﻿r﻿a﻿g﻿o﻿n﻿ ﻿s﻿a﻿y﻿s﻿ ﻿r﻿a﻿w﻿r`',
        key: 'dragon say rawr',
    },
    'fish': {
        msg: 'Type `w﻿h﻿y﻿ ﻿d﻿i﻿d﻿n﻿\'﻿t﻿ ﻿I﻿ ﻿j﻿u﻿s﻿t﻿ ﻿g﻿o﻿ ﻿f﻿i﻿s﻿h﻿i﻿n﻿g`',
        key: 'why didn\'t i just go fishing',
    },
};

const animals = {
    'duck': {
        name: 'Duck',
        emoji: '<:duckie:1078745078144696391>',
        size: 2,
    },
    'skunk': {
        name: 'Skunk',
        emoji: '🦨',
        size: 4,
    },
    'rabbit': {
        name: 'Rabbit',
        emoji: '🐇',
        size: 2,
    },
    'boar': {
        name: 'Boar',
        emoji: '🐗',
        size: 2,
    },
    'deer': {
        name: 'Deer',
        emoji: '🦌',
        size: 0,
    },
    'dragon': {
        name: 'Dragon',
        emoji: '🐲',
        size: 0,
    },
};


module.exports = {
	name: 'hunt',
	description: 'hunt hunt hunt',
	cooldown: 1000, // change to 15s
	userPerms: [],
	botPerms: [],
    keys: ['pls no eating me', 'holy shit a dragon', 'woah those are some toothers', 'oh frick a dragon',
        'dragon these nuts on your momma', 'dragon say rawr', 'why didn\'t i just go fishing'],
    boss: async (client, msg) => {
        if (events.get(msg.author.id) != msg.content) return;
        events.delete(msg.author.id);
        await client.db.findOrCreateInv(msg.author.id, 'dragon');

        const embed = { description: 'You went hunting, and came back with a fucking Dragon 🐲, what the hell?' };
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
        else if (res == 'dragon') {
            let event = Object.keys(legendary)[Math.floor(Math.random() * Object.keys(legendary).length)];
            event = legendary[event];
            events.set(msg.author.id, event.key);
            await msg.reply(eventMsg + event.msg);
            setTimeout(() => {
                if (events.get(msg.author.id)) {
                    events.delete(msg.author.id);
                    msg.reply('You went to shoot the dragon, and your weak little macaroni legs gave out and you fell. Missing the shot, the dragon ate you. LOL');
                }
            }, 10000);
        }
        else {
            const animal = animals[res];
            let amount = Math.floor(Math.random() * animal.size) + 1;
            await client.db.findOrCreateInv(msg.author.id, res, amount);

            if (amount == 1) amount = '';
            const embed = { description: `You cast out your line and brought back **${amount + ' ' + animal.emoji + ' ' + animal.name}**!` };
            await msg.reply({ embeds: [embed] });
        }
	},
};