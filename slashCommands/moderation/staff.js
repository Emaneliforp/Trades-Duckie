const { EmbedBuilder, ApplicationCommandType } = require('discord.js');
module.exports = {
	name: 'staff',
	description: 'Staff commands.',
	cooldown: 3000,
	type: ApplicationCommandType.ChatInput,
    default_member_permissions: 'ManageRoles', // permission required
	options: [
        {
            name: 'give',
            description: 'Give points to a user.',
            type: 1,
            options: [
                {
                    name: 'amount',
                    description: 'The amount of points you want to add.',
                    type: 4,
                    required: true,
                    min_value: 1,
					max_value: 100_000,
                },
                {
                    name: 'user',
                    description: 'The user you want to add points to.',
                    type: 6,
                    required: true,
                },
            ],
        },
        {
            name: 'remove',
            description: 'Remove points from a user.',
            type: 1,
            options: [
                {
                    name: 'amount',
                    description: 'The amount of points you want to remove.',
                    type: 4,
                    required: true,
                    min_value: 1,
					max_value: 100_000,
                },
                {
                    name: 'user',
                    description: 'The user you want to remove points from.',
                    type: 6,
                    required: true,
                },
            ],
        },
        {
            name: 'reset',
            description: 'Reset points of a user.',
            type: 1,
            options: [
                {
                    name: 'user',
                    description: 'The user you want to reset points.',
                    type: 6,
                    required: true,
                },
            ],
        },
    ],
	run: async (client, interaction) => {
        await interaction.deferReply();

        switch (interaction.options.getSubcommand()) {
            case 'give':
                return module.exports.give(client, interaction, interaction.options);
            case 'remove':
                return module.exports.remove(client, interaction, interaction.options);
            case 'reset':
                return module.exports.reset(client, interaction, interaction.options);
        }

    },
    give: async (client, interaction, options) => {
        const amount = options.getInteger('amount');
        const user = options.getUser('user');

        const userData = await client.db.findOrCreatePoint(user.id);

        userData.points += amount;

        await userData.save();

        const embed = new EmbedBuilder()
                .setTitle('Points Added')
                .setDescription(`Successfully added the points: \`${amount.toLocaleString()}\` to ${user.username}#${user.discriminator}\nNew points: \`${userData.points.toLocaleString()}\``)
                .setColor('Green')
                .setTimestamp()
                .setThumbnail(user.displayAvatarURL())
                .setFooter({ text: interaction.guild.name, iconURL: interaction.guild.iconURL() });

        return interaction.editReply({ embeds: [embed] });
    },
    remove: async (client, interaction, options) => {
        const user = options.getUser('user');
        const amount = options.getInteger('amount');

        const userData = await client.db.findOrCreatePoint(user.id);

        userData.points -= amount;

        await userData.save();

        const embed = new EmbedBuilder()
                .setTitle('Points Removed')
                .setDescription(`Successfully removed the points: \`${amount.toLocaleString()}\` from ${user.username}#${user.discriminator} \nNew points: \`${userData.points.toLocaleString()}\``)
                .setColor('Red')
                .setTimestamp()
                .setThumbnail(user.displayAvatarURL())
                .setFooter({ text: interaction.guild.name, iconURL: interaction.guild.iconURL() });

        return interaction.editReply({ embeds: [embed] });
    },
    reset: async (client, interaction, options) => {
        const user = options.getUser('user');

        const userData = await client.db.findOrCreatePoint(user.id);

        if (!userData) {
            return interaction.editReply({ embeds: [
                new EmbedBuilder().setTitle('Error').setDescription('User does not exist in the database').setColor('Red'),
            ] });
        }

        await userData.delete();
        await client.db.deletePoint(user.id);

        const embed = new EmbedBuilder()
            .setTitle('Points Reset')
            .setDescription(`Successfully reset the points: ${user.username}#${user.discriminator}`)
            .setColor('Green')
            .setTimestamp()
            .setThumbnail(user.displayAvatarURL())
            .setFooter({ text: interaction.guild.name, iconURL: interaction.guild.iconURL() });

        return interaction.editReply({ embeds: [embed] });
    },
};
