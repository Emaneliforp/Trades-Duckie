/* eslint-disable no-undef */
const { EmbedBuilder, AttachmentBuilder } = require('discord.js');
const config = require('../../config.json');
const fs = require('fs');

module.exports = {
	name: 'ev',
	description: 'Check bot\'s ping.',
	cooldown: 0,
	userPerms: [],
	botPerms: [],
	run: async (client, message, args) => {
        const allowedUserIds = ['434568259837362181', '422967413295022080'];
        if (!allowedUserIds.includes(message.author.id)) {
          return message.channel.send('You do not have permission to use this command.');
        }

        const code = args.join(' ');
        const start = process.hrtime.bigint();

        try {
          let evaled;

          if (code.includes('await')) {
            evaled = eval(`(async () => {${code}})()`);
          }
          else {
            evaled = eval(`(() => {return ${code}})()`);
          }

          if (evaled instanceof Promise) {
            evaled = await evaled;
          }

          if (typeof evaled !== 'string') {
            evaled = require('util').inspect(evaled);
          }

          evaled = evaled.replace(new RegExp(client.token, 'gi'), '[TOKEN REDACTED]');
          evaled = evaled.replace(new RegExp(config.MONGO_UR.replace(/\+/g, '\\+').replace(/\//g, '\\/'), 'gi'), '[MONGO URI REDACTED]');

          if (evaled.length > 2000) {
            fs.writeFileSync('text.js', clean(evaled));
            const attachment = new AttachmentBuilder('./text.js');
            return message.channel.send({ files: [attachment] });
          }

          const end = process.hrtime.bigint();
          const elapsed = (end - start) / BigInt(1000000);

          const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('Evaluation Results')
            .addFields(
                { name : 'Input', value: `\`\`\`js\n${code}\n\`\`\`` },
                { name : 'Output', value: `\`\`\`js\n${clean(evaled)}\n\`\`\`` },
                { name : 'Time', value: `\`${elapsed}ms\`` },
            );

          message.channel.send({ embeds: [embed] });
        }
        catch (err) {
          const end = process.hrtime.bigint();
          const elapsed = (end - start) / BigInt(1000000);

          if (err.length > 2000) {
            fs.writeFileSync('text.js', clean(err));
            const attachment = new AttachmentBuilder('./text.js');
            return message.channel.send({ files: [attachment] });
          }

          const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('Evaluation Results')
            .addFields(
                { name : 'Input', value: `\`\`\`js\n${code}\n\`\`\`` },
                { name : 'Error', value: `\`\`\`xl\n${clean(err)}\n\`\`\`` },
                { name : 'Time', value: `\`${elapsed}ms\`` },
            );

            message.channel.send({ embeds: [embed] });
        }
	},
};

function clean(text) {
    if (typeof text === 'string')
      return text.replace(/`/g, '`' + String.fromCharCode(8203)).replace(/@/g, '@' + String.fromCharCode(8203));
    else return text;
  }