const { EmbedBuilder, ApplicationCommandType, ApplicationCommandOptionType } = require('discord.js');

module.exports = {
	name: 'admin',
	description: 'Admin commands.',
	cooldown: 3000,
	type: ApplicationCommandType.ChatInput,
    default_member_permissions: 'Administrator',
    userPerms: 'Administrator', // permission required
	options: [
        {
            name: 'points',
            description: 'Manage points.',
            type: ApplicationCommandOptionType.SubcommandGroup,
            options: [
                {
                    name: 'give',
                    description: 'Give points to a user.',
                    type: ApplicationCommandOptionType.Subcommand,
                    options: [
                        {
                            name: 'amount',
                            description: 'The amount of points you want to add.',
                            type: ApplicationCommandOptionType.Integer,
                            required: true,
                            min_value: 1,
                            max_value: 100_000,
                        },
                        {
                            name: 'user',
                            description: 'The user you want to add points to.',
                            type: ApplicationCommandOptionType.User,
                            required: true,
                        },
                    ],
                },
                {
                    name: 'remove',
                    description: 'Remove points from a user.',
                    type: ApplicationCommandOptionType.Subcommand,
                    options: [
                        {
                            name: 'amount',
                            description: 'The amount of points you want to remove.',
                            type: ApplicationCommandOptionType.Integer,
                            required: true,
                            min_value: 1,
                            max_value: 100_000,
                        },
                        {
                            name: 'user',
                            description: 'The user you want to remove points from.',
                            type: ApplicationCommandOptionType.User,
                            required: true,
                        },
                    ],
                },
                {
                    name: 'reset',
                    description: 'Reset points of a user.',
                    type: ApplicationCommandOptionType.Subcommand,
                    options: [
                        {
                            name: 'user',
                            description: 'The user you want to reset points.',
                            type: ApplicationCommandOptionType.User,
                            required: true,
                        },
                    ],
                },
            ],
        },
        {
            name: 'coins',
            description: 'Manage coins.',
            type: ApplicationCommandOptionType.SubcommandGroup,
            options: [
                {
                    name: 'give',
                    description: 'Give coins to a user.',
                    type: ApplicationCommandOptionType.Subcommand,
                    options: [
                        {
                            name: 'amount',
                            description: 'The amount of coins you want to add.',
                            type: ApplicationCommandOptionType.Integer,
                            required: true,
                            min_value: 1,
                            max_value: 100_000,
                        },
                        {
                            name: 'user',
                            description: 'The user you want to add coins to.',
                            type: ApplicationCommandOptionType.User,
                            required: true,
                        },
                    ],
                },
                {
                    name: 'remove',
                    description: 'Remove coins from a user.',
                    type: ApplicationCommandOptionType.Subcommand,
                    options: [
                        {
                            name: 'amount',
                            description: 'The amount of coins you want to remove.',
                            type: ApplicationCommandOptionType.Integer,
                            required: true,
                            min_value: 1,
                            max_value: 100_000,
                        },
                        {
                            name: 'user',
                            description: 'The user you want to remove coins from.',
                            type: ApplicationCommandOptionType.User,
                            required: true,
                        },
                    ],
                },
                {
                    name: 'reset',
                    description: 'Reset coins of a user.',
                    type: ApplicationCommandOptionType.Subcommand,
                    options: [
                        {
                            name: 'user',
                            description: 'The user you want to reset coins.',
                            type: ApplicationCommandOptionType.User,
                            required: true,
                        },
                    ],
                },
            ],
        },
    ],
	run: async (client, interaction) => {
        await interaction.deferReply();

        switch (interaction.options.getSubcommandGroup()) {
            case 'points':
                module.exports.handlePoints(client, interaction);
                break;
            case 'coins':
                module.exports.handleCoins(client, interaction);
                break;
            default:
                break;
        }
    },
    handleCoins: async (client, interaction) => {
        switch (interaction.options.getSubcommand()) {
            case 'give':
                return module.exports.handleCoinsGive(client, interaction, interaction.options);
            case 'remove':
                return module.exports.handleCoinsRemove(client, interaction, interaction.options);
            case 'reset':
                return module.exports.handleCoinsReset(client, interaction, interaction.options);
        }
    },
    handlePoints: async (client, interaction) => {
        switch (interaction.options.getSubcommand()) {
            case 'give':
                return module.exports.handlePointsGive(client, interaction, interaction.options);
            case 'remove':
                return module.exports.handlePointsRemove(client, interaction, interaction.options);
            case 'reset':
                return module.exports.handlePointsReset(client, interaction, interaction.options);
        }
    },
    handlePointsGive: async (client, interaction, options) => {
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
    handlePointsRemove: async (client, interaction, options) => {
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
    handlePointsReset: async (client, interaction, options) => {
        const user = options.getUser('user');

        const userData = await client.db.findOrCreatePoint(user.id);

        if (!userData) {
            return interaction.editReply({ embeds: [
                new EmbedBuilder().setTitle('Error').setDescription('User does not exist in the database').setColor('Red'),
            ] });
        }

        userData.points = 0;
        await userData.save();

        const embed = new EmbedBuilder()
            .setTitle('Points Reset')
            .setDescription(`Successfully reset the points: ${user.username}#${user.discriminator}`)
            .setColor('Green')
            .setTimestamp()
            .setThumbnail(user.displayAvatarURL())
            .setFooter({ text: interaction.guild.name, iconURL: interaction.guild.iconURL() });

        return interaction.editReply({ embeds: [embed] });
    },
    handleCoinsGive: async (client, interaction, options) => {
        const amount = options.getInteger('amount');
        const user = options.getUser('user');

        const userData = await client.db.findOrCreateBalance(user.id);

        userData.amount += amount;

        await userData.save();

        const embed = new EmbedBuilder()
                .setTitle('Coins Added')
                .setDescription(`Successfully added the coins: \`${amount.toLocaleString()}\` to ${user.username}#${user.discriminator}\nNew coins: \`${userData.amount.toLocaleString()}\``)
                .setColor('Green')
                .setTimestamp()
                .setThumbnail(user.displayAvatarURL())
                .setFooter({ text: interaction.guild.name, iconURL: interaction.guild.iconURL() });

        return interaction.editReply({ embeds: [embed] });
    },
    handleCoinsRemove: async (client, interaction, options) => {
        const user = options.getUser('user');
        const amount = options.getInteger('amount');

        const userData = await client.db.findOrCreateBalance(user.id);

        userData.amount -= amount;

        await userData.save();

        const embed = new EmbedBuilder()
                .setTitle('Coins Removed')
                .setDescription(`Successfully removed the coins: \`${amount.toLocaleString()}\` from ${user.username}#${user.discriminator} \nNew coins: \`${userData.amount.toLocaleString()}\``)
                .setColor('Red')
                .setTimestamp()
                .setThumbnail(user.displayAvatarURL())
                .setFooter({ text: interaction.guild.name, iconURL: interaction.guild.iconURL() });

        return interaction.editReply({ embeds: [embed] });
    },
    handleCoinsReset: async (client, interaction, options) => {
        const user = options.getUser('user');

        const userData = await client.db.findOrCreateBalance(user.id);

        if (!userData) {
            return interaction.editReply({ embeds: [
                new EmbedBuilder().setTitle('Error').setDescription('User does not exist in the database').setColor('Red'),
            ] });
        }

        userData.amount = 0;
        await userData.save();

        const embed = new EmbedBuilder()
            .setTitle('Coins Reset')
            .setDescription(`Successfully reset the coins: ${user.username}#${user.discriminator}`)
            .setColor('Green')
            .setTimestamp()
            .setThumbnail(user.displayAvatarURL())
            .setFooter({ text: interaction.guild.name, iconURL: interaction.guild.iconURL() });

        return interaction.editReply({ embeds: [embed] });
    },
};
