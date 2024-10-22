const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'clear',
    description: 'Clears a specified number of messages from the current channel.',
    options: [
        {
            name: 'amount',
            description: 'Number of messages to clear (1-100)',
            type: 4, // Integer type
            required: true
        }
    ],

    async execute(interaction) {
        const amount = interaction.options.getInteger('amount');

        if (amount < 1 || amount > 100) {
            return interaction.reply({
                content: 'Please enter a number between 1 and 100.',
                ephemeral: true
            });
        }

        try {
            const deletedMessages = await interaction.channel.bulkDelete(amount, true);

            const embed = new EmbedBuilder()
                .setTitle('Messages Cleared')
                .setDescription(`Successfully cleared ${deletedMessages.size} messages.`)
                .setColor('#55c0c8')
                .setFooter({
                    text: `Cleared by ${interaction.user.tag}`,
                    iconURL: interaction.user.displayAvatarURL(),
                })
                .setTimestamp();

            await interaction.reply({ embeds: [embed], ephemeral: true });
        } catch (error) {
            console.error('Error clearing messages:', error);
            interaction.reply({
                content: 'There was an error while trying to clear messages. Please try again.',
                ephemeral: true
            });
        }
    }
};
