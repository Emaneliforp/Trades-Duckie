const { ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
module.exports = {
    data: {
        name: 'help',
        description: 'Show all available features or information of specified feature',
        help: 'Show all available features or information of specified feature',
        cooldown: { text: '`3s`', value: 3 },
        options: [
            {
                name: 'feature',
                description: 'name of the feature',
                type: 3,
                required: false,
                choices: [
                    {
                        name: 'ping',
                        value: 'ping',
                    },
                ],
            },
        ],
    },
    async generateRow(client) {
        return new ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId('help feature')
                    .setPlaceholder('select a feature')
                    .addOptions([
                        {
                            label: 'ping',
                            description: client.commands.get('tp').data.description,
                            value: 'ping',
                        },
                    ]),
            );
    },
    async generateFeatureHelp(command) {
        return {
            title: `${command.name} help`,
            description: command.help,
            fields:[
                {
                    name: 'Cooldown',
                    value: command.cooldown.text,
                },
            ],
        };
    },
	async execute(interaction, client) {
		const feature = interaction.options.getString('feature');
		let help;
        const row = await this.generateRow(client);
        if (feature != null) {
            return this.feature(interaction, client, row);
        }
        else {
            help = {
                title: 'Duckie help',
                description: '<a:duckHead:764728615186595850>',
                fields:[
                    {
                        name: 'ping',
                        value: `${(client.commands.get('ping').data.emoji) ? `\`${client.commands.get('ping').data.emoji}\` ` : ''}${client.commands.get('ping').data.description}`,
                    },
                ],
            };
        }
		return client.embed(interaction, help, false, row);
	},
    async select(interaction, client) {
        const command = client.commands.get(interaction.values[0]).data;
        const row = await this.generateRow(client);
        const help = await this.generateFeatureHelp(command);
        if (command.footer)
            help.footer = { text: command.footer };
        await interaction.update({ embeds: [help], components: [row] });
    },
    async feature(interaction, client, row) {
        const feature = interaction.options.getString('feature');
        const command = client.commands.get(feature).data;
        const help = await this.generateFeatureHelp(command);
        if (command.footer)
            help.footer = { text: command.footer };
        return client.embed(interaction, help, false, row);
    },
};