require("dotenv").config();

const {
  Client,
  Events,
  GatewayIntentBits,
  ActivityType,
  SlashCommandBuilder,
} = require("discord.js");

const fetch = require("node-fetch"); // Using an older version of node fetch

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

let githubRepo = "";
let lastCommitSha = null;
let channelId = null;

client.on(Events.ClientReady, (client) => {
  console.log(`${client.user.tag} is ready!`);
  client.user.setActivity("new commits", {
    type: ActivityType.Watching,
  });

  const repository = new SlashCommandBuilder()
    .setName("repo") // <--- command names must be lowercase
    .setDescription("Accepts github repository url as a parameter.")
    .addStringOption((option) =>
      option
        .setName("repository")
        .setDescription("Enter your GitHub repository's url.")
        .setRequired(true)
    );

  client.application.commands.create(repository); // <--- Can pass in guild ID as a second argument. This will only give specified guilds (servers) access to the command.

  setInterval(fetchCommits, 60000); // Checks every minute
});

client.on(Events.InteractionCreate, (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName == "repo") {
    repoUrl = interaction.options.getString("repository");

    const match = repoUrl.match(/https:\/\/github\.com\/([^/]+)\/([^/]+)/); // Regex for checking user input

    if (!match) {
      return interaction.reply(
        "Invalid GitHub repository URL, please try again!"
      );
    }
    channelId = interaction.channelId;

    const [, owner, repo] = match;
    githubRepo = `${owner}/${repo}`;

    interaction.reply(`Tracking github repository: ${githubRepo}`);
  }
});

async function fetchCommits() {
  if (!githubRepo || !channelId) return;

  const url = `https://api.github.com/repos/${githubRepo}/commits`;
  const headers = {
    Accept: "application/vnd.github.v3.json",
    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
  };

  try {
    const response = await fetch(url, { headers });

    if (!response.ok) return;

    const commits = await response.json();

    if (commits.length > 0) {
      const latestCommit = commits[0];

      if (latestCommit.sha !== lastCommitSha) {
        lastCommitSha = latestCommit.sha;

        const commitMessage =
          `**New Commit in ${githubRepo}**\n` +
          `Message: ${latestCommit.commit.message}\n` +
          `Author: ${latestCommit.commit.author.name}\n` +
          `URL: ${latestCommit.html_url}`;

        const channel = client.channels.cache.get(channelId);
        if (channel) channel.send(commitMessage);
      }
    }
  } catch (error) {
    console.error("Error fetching commits:", error);
  }
}

// Replace with discord bot token
client.login(process.env.TOKEN);
