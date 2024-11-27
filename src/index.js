require("dotenv").config();

const {
  Client,
  Events,
  GatewayIntentBits,
  EmbedBuilder,
  PermissionsBitField,
  Permissions,
  ActivityType,
  SlashCommandBuilder,
  SharedSlashCommandOptions,
} = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.on(Events.ClientReady, (client) => {
  console.log(`${client.user.tag} is ready!`);
  client.user.setActivity("new commits", {
    type: ActivityType.Watching,
  });
  const ping = new SlashCommandBuilder()
    .setName("ping") // <--- command names must be lowercase
    .setDescription("Replies with pong!");

  const test = new SlashCommandBuilder()
    .setName("test")
    .setDescription("test")
    .addStringOption((option) =>
      option.setName("input").setDescription("Enter input").setRequired(true)
    );

  client.application.commands.create(ping); // <--- Can pass in guild ID as a second argument, this will only give specified guilds (servers) access to the command.
  client.application.commands.create(test);
});

client.on(Events.InteractionCreate, (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName == "ping") {
    interaction.reply("Pong!");
  }
  if (interaction.commandName == "test") {
    const userInput = interaction.options.getString("input");

    interaction.reply(`You said: ${userInput}`);
  }
});

// Replace with discord bot token
client.login(process.env.TOKEN);
