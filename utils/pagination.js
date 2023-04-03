const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js');

class Pagination {
  constructor(message, data, itemsPerPage, embedTitle, format) {
    this.message = message;
    this.data = data;
    this.itemsPerPage = itemsPerPage;
    this.embedTitle = embedTitle;
    this.currentPage = 1;
    this.format = format;
  }

  async send() {
    const totalPages = Math.ceil(this.data.length / this.itemsPerPage);

    const embed = new EmbedBuilder()
      .setTitle(this.embedTitle)
      .setDescription(this.getDataForPage(this.currentPage))
      .setFooter({ text: `Page ${this.currentPage} of ${totalPages}` });

    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('prev')
          .setLabel('Previous')
          .setStyle('Primary')
          .setDisabled(this.currentPage === 1),
        new ButtonBuilder()
          .setCustomId('next')
          .setLabel('Next')
          .setStyle('Primary')
          .setDisabled(this.currentPage === totalPages),
      );

    const sentMessage = await this.message.channel.send({
      embeds: [embed],
      components: [row],
    });

    const filter = (i) => i.user.id === this.message.author.id;
    const collector = sentMessage.createMessageComponentCollector({
      filter,
      time: 15000,
    });

    collector.on('collect', async (i) => {
        console.log('hi');
      await i.deferUpdate();

      if (i.customId === 'prev') {
        this.currentPage--;
      }
      else if (i.customId === 'next') {
        this.currentPage++;
      }

      const newData = this.getDataForPage(this.currentPage);

      const newEmbed = new EmbedBuilder()
        .setTitle(this.embedTitle)
        .setDescription(newData)
        .setFooter({ text: `Page ${this.currentPage} of ${totalPages}` });

      sentMessage.edit({
        embeds: [newEmbed],
      });

      row.components[0].setDisabled(this.currentPage === 1);
      row.components[1].setDisabled(this.currentPage === totalPages);

      sentMessage.edit({
        components: [row],
      });
    });

    collector.on('end', () => {
      row.components[0].setDisabled(true);
      row.components[1].setDisabled(true);

      sentMessage.edit({
        components: [row],
      });
    });
  }

  getDataForPage(page) {
    const startIndex = (page - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    const pageData = this.data.slice(startIndex, endIndex);

    let result = '';

    pageData.forEach((data, index) => {
        result += this.format(data, index + 1);
    });

    return result;
  }
}

module.exports = Pagination;
