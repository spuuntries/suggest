require("dotenv").config();

const procenv = process.env,
  Discord = require("discord.js"),
  client = new Discord.Client({
    intents: [
      "GUILDS",
      "GUILD_MEMBERS",
      "GUILD_MESSAGES",
      "GUILD_MESSAGE_REACTIONS",
    ],
  }),
  Enmap = require("enmap").default,
  db = (() => {
    return new Enmap({
      name: "db",
    });
  })(),
  crypt = require("./utils/crypto");

function logger(message) {
  console.log(`[${new Date()}] ${message}`);
}

function login() {
  client.login(procenv.TOKEN).catch((err) => {
    logger(`Failed to login, retrying in 5 seconds...`);
    setTimeout(login, 5000);
  });
}

login();

client.once("ready", () => {
  logger(`Logged in as ${client.user.tag}!`);

  // Check if configured encryption key is correct
  ((key) => {
    if (db.size == 0) {
      logger("No data found in database, adding a sample entry...");
      db.set("test", crypt.encrypt("test", key));
      logger("Done! Skipping key check for now.");
    }
    logger(`Found ${db.size} entries in database, checking key...`);
    if (crypt.decrypt(db.get("test"), key) != "test") {
      throw new Error("Invalid encryption key!");
    }
    logger("Key check passed!");
  })(procenv.ENCRYPTION_KEY);

  // Do slash command checkup on every guild
  client.guilds.fetch({}).then((guilds) => {
    guilds.forEach((guild) => {
      // NOTE: This fetch is probably redundant, but the typing dictates it,
      // I'd rather not risk it as I don't know if Discord.OAuth2Guild extends Discord.Guild,
      // based on the typings though, I'm fairly sure it's not.
      guild.fetch().then((guild) => {
        guild.commands.fetch().then((commands) => {
          // Check if slash command is deployed
          if (!commands.filter((command) => command.name == "suggest").size) {
            logger(`Deploying slash command to ${guild.name}...`);

            guild.commands.create({
              name: "suggest",
              description: `Suggest a new feature for ${
                procenv.GUILD_NAME
                  ? procenv.GUILD_NAME
                  : (() => {
                      logger(
                        "No GUILD_NAME specified in .env, using default value..."
                      );
                      return guild.name;
                    })()
              }`,
              options: [
                {
                  name: "create",
                  description: "Create a new suggestion",
                  required: true,
                  type: "SUB_COMMAND",
                  options: [
                    {
                      name: "type",
                      description: "The type of suggestion",
                      type: "STRING",
                      required: true,
                      choices: ["feature", "prompt"],
                    },
                    {
                      name: "content",
                      description: "The content of the suggestion",
                      type: "STRING",
                      required: true,
                    },
                  ],
                },
              ],
            });
          } else {
            logger(`Slash command already deployed to ${guild.name}`);
          }
        });
      });
    });
  });
  client.on("ready", () => {
    logger(`Re-logged in as ${client.user.tag}!`);
  });
});
