const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'reminder',
    description: 'Set a reminder and get notified after a certain amount of time.',
    options: [
        {
            name: 'time',
            description: 'The time after which you want to be reminded (e.g., 10s, 5m, 1h).',
            type: 3, // String
            required: true
        },
        {
            name: 'message',
            description: 'The reminder message.',
            type: 3, // String
            required: true
        }
    ],

    async execute(interaction) {
        const time = interaction.options.getString('time');
        const reminderMessage = interaction.options.getString('message');

        // Convert the time input into milliseconds
        const timeValue = parseTimeInput(time);

        if (timeValue === null) {
            return interaction.reply({
                content: 'Invalid time format. Please use "s" for seconds, "m" for minutes or "h" for hours.',
                ephemeral: true
            });
        }

        // Send a confirmation message to the user
        interaction.reply({
            content: `Reminder set! I'll remind you in **${time}**.`,
            ephemeral: true
        });

        // Wait for the specified time, then send the reminder
        setTimeout(async () => {
            const embed = new EmbedBuilder()
                .setTitle('Reminder.')
                .setDescription(reminderMessage)
                .setColor('#55c0c8')
                .setFooter({
                    text: `Reminder set by ${interaction.user.tag}`,
                    iconURL: interaction.user.displayAvatarURL()
                })
                .setTimestamp();

            try {
                await interaction.user.send({ embeds: [embed] });
            } catch (error) {
                console.error('Failed to send a reminder:', error);
                await interaction.channel.send({
                    content: `${interaction.user}, you wanted me to remind you.`,
                    embeds: [embed]
                });
            }
        }, timeValue);
    }
};

// Helper function to parse time input into milliseconds
function parseTimeInput(time) {
    const timeRegex = /^(\d+)([smh])$/;
    const match = time.match(timeRegex);

    if (!match) return null;

    const value = parseInt(match[1]);
    const unit = match[2];

    switch (unit) {
        case 's': return value * 1000;         // Seconds to milliseconds
        case 'm': return value * 60 * 1000;    // Minutes to milliseconds
        case 'h': return value * 60 * 60 * 1000; // Hours to milliseconds
        default: return null;
    }
}