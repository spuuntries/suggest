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
  crypt = require("./utils/crypto"),
  deploy = require("./utils/deploy"),
  logger = require("./utils/logger");

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
        deploy(client, guild);
      });
    });
  });
  client.on("ready", () => {
    logger(`Re-logged in as ${client.user.tag}!`);
  });
});
