const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'profile',
    description: 'Displays a profile card of the selected user.',
    execute: async (interaction) => {
        const user = interaction.options.getUser('user') || interaction.user;

        const member = interaction.guild.members.cache.get(user.id);
        // Create an embedded message for the profile
        const embed = new EmbedBuilder()
            .setColor('#55c0c8')
            .setTitle(`Displaying ${user.username}'s profile`)
            .setThumbnail(user.displayAvatarURL({ dynamic: true, size: 1024 }))
            .addFields(
                { name: 'Username:', value: `${user.username}`, inline: false },
                { name: 'ID:', value: `${user.id}`, inline: false },
                { name: 'This account was created at:', value: `${user.createdAt.toDateString()}`, inline: false },
                { name: 'Has joined this server at:', value: `${member.joinedAt.toDateString()}`, inline: false },
                { name: 'Roles given:', value: `${member.roles.cache.map(role => role.name).join(', ') || 'No roles given.'}`, inline: false }
            )
            .setFooter({
                text: `Requested by ${interaction.user.username}`,
                iconURL: interaction.user.displayAvatarURL(),
            })
            .setTimestamp();

        // Send the embedded profile information
        await interaction.reply({ embeds: [embed] });
    },
};
