const events = new Map;

const chances = [8, 10, 6, 1, 2];
const outcomes = ['none', 'fish', 'rare', 'exotic', 'legendary'];
const size = 26;

const nones = [
    'LMAO you found nothing. NICE!',
    'lol you suck, you found nothing',
    'You cast out your line and sadly didn\'t get a bite.',
    'Awh man, no fish wanted your rod today.',
];

const eventMsg = 'ahhhhh the fish is too strong and your line is at risk to break! quick, type the phrase below in the next 10 seconds\n';
const legendary = {
    'fish': {
        msg: 'Type `f\uFEFFi\uFEFFs\uFEFFh\uFEFF \uFEFFf\uFEFFi\uFEFFs\uFEFFh\uFEFF \uFEFFf\uFEFFi\uFEFFs\uFEFFh\uFEFF \uFEFFf\uFEFFi\uFEFFs\uFEFFh\uFEFFy\uFEFF`',
        key: 'fish fish fish fishy',
    },
    'camera': {
        msg: 'Type `g\uFEFFe\uFEFFt\uFEFF \uFEFFt\uFEFFh\uFEFFe\uFEFF \uFEFFc\uFEFFa\uFEFFm\uFEFFe\uFEFFr\uFEFFa\uFEFF \uFEFFr\uFEFFe\uFEFFa\uFEFFd\uFEFFy\uFEFF`',
        key: 'get the camera ready',
    },
    'hook': {
        msg: 'Type `h\uFEFFo\uFEFFo\uFEFFk\uFEFF \uFEFFl\uFEFFi\uFEFFn\uFEFFe\uFEFF \uFEFFs\uFEFFi\uFEFFn\uFEFFk\uFEFFe\uFEFFr\uFEFF`',
        key: 'hook line stinker',
    },
    'glub': {
        msg: 'Type `g\uFEFFl\uFEFFu\uFEFFb\uFEFF \uFEFFg\uFEFFl\uFEFFu\uFEFFb\uFEFF \uFEFFg\uFEFFl\uFEFFu\uFEFFb\uFEFF`',
        key: 'glub glub glub',
    },
    'big': {
        msg: 'Type `w\uFEFFo\uFEFFa\uFEFFh\uFEFF \uFEFFa\uFEFF \uFEFFb\uFEFFi\uFEFFg\uFEFF \uFEFFo\uFEFFn\uFEFF\uFEFFe`',
        key: 'woah a big one',
    },
    'fishy': {
        msg: 'Type `t\uFEFFh\uFEFFi\uFEFFs\uFEFF \uFEFFi\uFEFFs\uFEFF \uFEFFv\uFEFFe\uFEFFr\uFEFFy\uFEFF \uFEFFf\uFEFFi\uFEFFs\uFEFFh\uFEFFy\uFEFF`',
        key: 'this is very fishy',
    },
    'bait': {
        msg: 'Type `B\uFEFFi\uFEFFg\uFEFF \uFEFFb\uFEFFa\uFEFFi\uFEFFt\uFEFF \uFEFFc\uFEFFa\uFEFFt\uFEFFc\uFEFFh\uFEFFe\uFEFFs\uFEFF \uFEFFb\uFEFFi\uFEFFg\uFEFF \uFEFFf\uFEFFi\uFEFFs\uFEFFh\uFEFF`',
        key: 'big bait catches big fish',
    },
    'big_fishy': {
        msg: 'Type `b\uFEFFi\uFEFFg\uFEFF \uFEFFf\uFEFFi\uFEFFs\uFEFFh\uFEFFy\uFEFF`',
        key: 'big fishy',
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
	cooldown: 20000, // change to 15s
	userPerms: [],
	botPerms: [],
    keys: ['fish fish fish fishy', 'get the camera ready', 'hook line stinker', 'glub glub glub',
        'woah a big one', 'this is very fishy', 'big bait catches big fish', 'big fishy'],
    boss: async (client, msg) => {
        if (events.get(msg.author.id) != msg.content) return;
        events.delete(msg.author.id);
        await client.db.findOrCreateInv(msg.author.id, 'legendary');

        const embed = { description: `You cast out your line and brought back a **${fishes['legendary'].emoji + ' ' + fishes['legendary'].name}**, nice catch!` };
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
            await msg.reply(eventMsg + event.msg);
            setTimeout(() => {
                if (events.get(msg.author.id)) {
                    events.delete(msg.author.id);
                    msg.reply('The fish on hook is too strong, your fishing rod broke!');
                }
            }, 10000);
        }
        else {
            const fish = fishes[res];
            let amount = Math.floor(Math.random() * fish.size) + 1;
            await client.db.findOrCreateInv(msg.author.id, res, amount);

            if (amount == 1) amount = '';
            const embed = { description: `You cast out your line and brought back **${amount + ' ' + fish.emoji + ' ' + fish.name}**!` };
            await msg.reply({ embeds: [embed] });
        }
	},
};