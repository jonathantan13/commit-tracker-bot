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

  const hello = new SlashCommandBuilder()
    .setName("hello")
    .setDescription("This is a hello command!");

  client.application.commands.create(ping); // <--- Can pass in guild ID as a second argument, this will only allow specified guilds access to the command.
  client.application.commands.create(hello);
});

client.on("interactionCreate", (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName == "ping") {
    interaction.reply("Pong!");
  }
  if (interaction.commandName == "hello") {
    interaction.reply(
      "Hello new world all the boys and girls I got some true stories to tell!"
    );
  }
});

client.login(process.env.TOKEN);
