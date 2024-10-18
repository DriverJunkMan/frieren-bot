const { Client, GatewayIntentBits, REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');
// const { CognitiveServicesCredentials } = require('@azure/ms-rest-azure-js');
// const { TranslatorTextClient } = require('@azure/cognitiveservices-translatortext');
require('dotenv').config();

// Initialize Discord client
const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

// Load commands
client.commands = new Map();
const commands = [];
const commandsFolder = path.join(__dirname, 'commands');

// Read all command files from subfolders
fs.readdirSync(commandsFolder).forEach((folder) => {
    const folderPath = path.join(commandsFolder, folder);
    fs.readdirSync(folderPath).forEach((file) => {
        if (file.endsWith('.js')) {
            const command = require(path.join(folderPath, file));
            client.commands.set(command.name, command);
            // Push command's data to commandsArray for registration
            commands.push({
                name: command.name,
                description: command.description,
                options: command.options || [],
            });

            if (command.aliases) {
                command.aliases.forEach(alias => {
                    client.commands.set(alias, command);
                });
            }
        }
    });
});

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
    try {
        console.log('Started refreshing application commands.');

        await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID),
            { body: commands },
        );
        
        console.log('Successfully reloaded application commands.');
    } catch (error) {
        console.error('Error while deploying commands:', error);
    }
})();

// Azure Translator setup
/*const translatorApiKey = process.env.AZURE_TRANSLATOR_API_KEY;
const translatorEndpoint = process.env.AZURE_TRANSLATOR_ENDPOINT;
const credentials = new CognitiveServicesCredentials(translatorApiKey);
const translatorClient = new TranslatorTextClient(credentials, translatorEndpoint);
const DEFAULT_LANGUAGE = 'en';

// Function to translate text
async function translateText(text, targetLanguage) {
    // Check if API key and endpoint are set
    if (!translatorApiKey || !translatorEndpoint) {
        console.warn("Azure Translator API key or endpoint not provided. Returning original text.");
        return text; // Fallback to original text
    }
    
    try {
        const response = await translatorClient.translate([{ text: text }], targetLanguage);
        return response[0].translations[0].text;
    } catch (error) {
        console.error("Translation error:", error);
        return text; // Fallback to original text if translation fails
    }
}

// Detect user's locale (user's selected language)
async function getUserLocale(guildId, userId) {
    const guild = client.guilds.cache.get(guildId);
    const member = guild.members.cache.get(userId);
    const locale = member?.user?.locale || 'en'; // Default to 'en' if locale not found
    return locale.split('-')[0]; // Return the language code
}*/

// Command handler with translation
client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    console.log(`Received command: ${interaction.commandName}`);
    const command = client.commands.get(interaction.commandName);
    if (!command) {
        console.log(`Command not found: ${interaction.commandName}`);
        return;
    }

    /*// Get user locale or fall back to default
    const userLocale = await getUserLocale(interaction.guildId, interaction.user.id) || DEFAULT_LANGUAGE;

    try {
        await command.execute(interaction, userLocale, translateText);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }*/
        try {
            await command.execute(interaction); // Pass necessary parameters if needed
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
});

// Bot login
client.login(process.env.DISCORD_TOKEN);