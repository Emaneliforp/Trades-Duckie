const { EmbedBuilder } = require('discord.js');
const dailySchema = require('../../schemas/dailySchema');
const pointSchema = require('../../schemas/pointSchema');
module.exports = {
    name: 'daily',
    description: 'Check your daily rewards.',
    cooldown: 0,
    userPerms: [],
    botPerms: [],
    run: async (client, message) => {
        let daily = await dailySchema.findOne({ userId: message.author.id });
        if (!daily) {
            // last claimed should be yesterday date before 00:00:00
            daily = new dailySchema({
                userId: message.author.id,
                streak: 0,
                lastRan: new Date().setHours(0, 0, 0, 0) - 86400000,
            });
            await daily.save();
        }
        // You can also use the <t:timestamp> format, where timestamp is the Unix timestamp
        // t: Short time (e.g. 9:41 PM)
        // T: Long Time (e.g. 9:41:30 PM)
        // d: Short Date (e.g. 30/06/2021)
        // D: Long Date (e.g. 30 June 2021)
        // f (default): Short Date/Time (e.g. 30 June 2021 9:41 PM)
        // F: Long Date/Time (e.g. Wednesday, June, 30, 2021 9:41 PM)
        // R: Relative Time (e.g. 2 months ago, in an hour)2.
        const date = new Date();
        date.setDate(date.getDate() + 1);
        date.setHours(0, 0, 0, 0);
        const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('Daily')
            // show streaks, last claimed in discord unix time stamp format relative time
            // next claim in discord unix time stamp format relative time should be date
            .setDescription(`Daily Streak: ${daily.streak} \nLast Claimed: <t:${Math.floor(daily.lastRan / 1000)}:R> \nNext Claim: <t:${Math.floor(date / 1000)}:R>`)
            .setFooter({ text: message.author.tag, iconURL: message.author.displayAvatarURL() });

        message.channel.send({ embeds: [embed] });
    },
    checkDaily: async (message) => {
        let userData = await dailySchema.findOne({ userId: message.author.id });
        let pointData = await pointSchema.findOne({ userId: message.author.id });
        if (!userData) {
            userData = new dailySchema({
                userId: message.author.id,
                streak: 0,
                lastRan: new Date().setHours(0, 0, 0, 0) - 86400000,
            });
            await userData.save();
        }

        if (!pointData) {
            pointData = new pointSchema({
                userId: message.author.id,
                points: 0,
            });
            await pointData.save();
        }

        const date = new Date();
        date.setDate(date.getDate());
        date.setHours(0, 0, 0, 0);
        if (userData.lastRan < date) {
            // use increment operator to add 1 to streak and set the lastRan to current date
            await dailySchema.updateOne({ userId: message.author.id }, { $inc: { streak: 1 }, $set: { lastRan: new Date() } });
            await pointSchema.updateOne({ userId: message.author.id }, { $inc: { points: module.exports.logistic(userData.streak + 1) } });
            message.reply(`You claimed ${module.exports.logistic(userData.streak + 1)} server points! Streak: ${userData.streak + 1}`);
        }

    },
    logistic: (x) => {
        const k = 0.1; // growth rate
            const mid = 50; // midpoint of growth
            const yMin = 70; // minimum value
            const yMax = 1000; // maximum value
            const y = yMin + ((yMax - yMin) / (1 + Math.exp(-k * (x - mid))));
            return Math.ceil(y);
    },
};