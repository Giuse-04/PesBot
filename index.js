// Description: The main entry point for the bot.

// fs is used to read the commands directory and identify our command files
const fs = require('node:fs');

// path helps construct paths to access files and directories. One of the advantages of the path module is that it automatically detects the operating system and uses the appropriate joiners.
const path = require('node:path');

// Require the necessary discord.js classes
const { Client, Collection, Events, GatewayIntentBits, MessageFlags } = require('discord.js');
const { token } = require('./config.json');

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection(); // Is like Map Class
const foldersPath = path.join(__dirname, 'commands');
//reads the path to the directory and returns an array of all the folder names it contains
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
    //reads the path to this directory and returns an array of all the file names they contain
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		// Set a new item in the Collection with the key as the command name and the value as the exported module
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

// When the client is ready, run this code (only once).
client.once(Events.ClientReady, readyClient => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

// You will receive an interaction for every slash command executed. To respond to a command, you need to create a listener for the Client#interactionCreate event that will execute code when your application receives an interaction.
client.on(Events.InteractionCreate, async interaction => {
    // If the interaction isn't a slash command, return
	if (!interaction.isChatInputCommand()) return;

    // you need to get the matching command from the client.commands Collection based on the interaction.commandName. Your Client instance is always available via interaction.client
	const command = interaction.client.commands.get(interaction.commandName);

    //  If no matching command is found, log an error to the console and ignore the event.
	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	console.log(`Executing command: ${interaction.commandName}`);
    // With the right command identified, all that's left to do is call the command's .execute() method and pass in the interaction variable as its argument. In case something goes wrong, catch and log any error to the console.
	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
		}
	}
});

// Log in to Discord with your client's token
client.login(token);
