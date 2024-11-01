/*const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('avatar')
        .setDescription('Displays a user\'s avatar')
        .addUserOption(option => option.setName('target').setDescription('Select a user')),
    async execute(interaction, userLocale, translateText) {
        const user = interaction.options.getUser('target') || interaction.user;
        const avatarUrl = user.displayAvatarURL({ dynamic: true, size: 1024 });
        const translatedMessage = await translateText(`Here is ${user.username}'s avatar!`, userLocale);

        await interaction.reply({
            embeds: [{
                color: '#7289da',
                title: await translateText('User Avatar', userLocale),
                description: translatedMessage,
                image: { url: avatarUrl },
                footer: { text: await translateText('Need some help? Try /help for more information.', userLocale) },
                timestamp: new Date()
            }]
        });
    },
};*/

const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'avatar',
    description: 'Displays the avatar of the selected user.',
    execute: async (interaction) => {
        
        const user = interaction.options.getUser('user') || interaction.user;

        const embed = new EmbedBuilder()
            .setColor('#55c0c8') // Custom color
            .setDescription(`Showing ${user.username} avatar's`)
            .setImage(user.displayAvatarURL({ dynamic: true, size: 1024 }))
            .setFooter({
                text: `Resquested by ${interaction.user.username}`,
                iconURL: interaction.user.displayAvatarURL(),
            })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
};