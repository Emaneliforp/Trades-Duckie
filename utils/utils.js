const cron = require('node-cron');
const { Collection } = require('discord.js');
module.exports = class Utils {
    static error(client, type, info, err) {
        client.DB.ref('error/' + type).push({ info: info, error: err })
            .catch(console.error);
    }
    static sendMessage(interaction, content, ephemeral) {
        if (!ephemeral) ephemeral = false;
        interaction.reply({ content: content, ephemeral: ephemeral })
            .catch(() => {
                interaction.user.send({ content: `I might be missing permission to send message in <#${interaction.channelId}>.\nIf this is caused by lag, please disregard.` })
                    .catch(() => { return;});
            });
    }
    static getRandomColor() {
        const colorPalette = ['#1abc9c', '#2ecc71', '#3498db', '#9b59b6', '#e91e63', '#f1c40f', '#e67e22', '#e74c3c', '#ffffff', '#23272a'];
        return colorPalette[Math.floor(Math.random() * colorPalette.length)];
    }

    static isValidAmount(amount) {
      // Define a regular expression to match valid amounts
      const regex = /^([+-]?\d*\.?\d+(?:[eE][+-]?\d+)?)(k|m|mil|thousand|million)?$/i;

      // Test the amount against the regular expression
      const match = regex.exec(amount);

      if (match) {
        // If the regular expression matches, extract the numeric value and suffix
        const value = parseFloat(match[1]);
        const suffix = match[2];

        // Determine the multiplier based on the suffix
        let multiplier = 1;
        if (suffix === 'k' || suffix === 'thousand') {
          multiplier = 1000;
        }
        else if (suffix === 'm' || suffix === 'mil' || suffix === 'million') {
          multiplier = 1000000;
        }

        // Multiply the numeric value by the multiplier and return the result
        return value * multiplier;
      }
      else {
        // If the regular expression doesn't match, the amount is not valid
        return false;
      }
    }

    static clearDailies(client) {
      // write a cron task to clear dailies which is a collection every day at 00:00
      cron.schedule('0 0 * * *', () => {
        client.dailies = new Collection();
      });
    }

};