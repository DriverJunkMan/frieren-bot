const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'profile',
    description: 'Displays your profile or another user\'s profile information.',
    execute: async (interaction) => {
        const user = interaction.options.getUser('user') || interaction.user;

        const member = interaction.guild.members.cache.get(user.id);
        // Create an embedded message for the profile
        const embed = new EmbedBuilder()
            .setColor('#55c0c8')
            .setTitle(`${user.username}'s profile`)
            .setThumbnail(user.displayAvatarURL({ dynamic: true, size: 1024 }))
            .addFields(
                { name: 'Username:', value: `${user.username}`, inline: false },
                { name: 'ID:', value: `${user.id}`, inline: false },
                { name: 'Account Created:', value: `${user.createdAt.toDateString()}`, inline: false },
                { name: 'Joined Server:', value: `${member.joinedAt.toDateString()}`, inline: false },
                { name: 'Roles:', value: `${member.roles.cache.map(role => role.name).join(', ') || 'No roles given.'}`, inline: false }
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
