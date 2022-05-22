const Discord = require("discord.js");

/**
 * Deploys slash command to Discord guilds.
 * @param {Discord.Client} client The Discord client instance
 * @param {Discord.Guild} guild The Discord guild instance
 */
module.exports = (client, guild) => {
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
                name: "title",
                description: "The title of the suggestion",
                type: "STRING",
                required: true,
              },
              {
                name: "content",
                description: "The content of the suggestion",
                type: "STRING",
                required: true,
              },
              {
                name: "thumbnail",
                description: "The thumbnail of the suggestion",
                type: "STRING",
              },
              {
                name: "anonymous",
                description: "Whether the suggestion is anonymous",
                type: "BOOLEAN",
                required: true,
              },
            ],
          },
          {
            name: "list",
            description: "List all suggestions",
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
                name: "yours",
                description: "List your suggestions",
                type: "BOOLEAN",
              },
            ],
          },
          {
            name: "delete",
            description: "Delete a suggestion",
            type: "SUB_COMMAND",
            options: [
              {
                name: "id",
                description: "The ID of the suggestion",
                type: "STRING",
                required: true,
              },
            ],
          },
          {
            name: "vote",
            description: "Vote on a suggestion",
            type: "SUB_COMMAND",
            options: [
              {
                name: "id",
                description: "The ID of the suggestion",
                type: "STRING",
                required: true,
              },
              {
                name: "vote",
                description: "The vote to cast",
                type: "STRING",
                required: true,
                choices: ["up", "down"],
              },
            ],
          },
          {
            name: "edit",
            description: "Edit a suggestion",
            type: "SUB_COMMAND",
            options: [
              {
                name: "id",
                description: "The ID of the suggestion",
                type: "STRING",
                required: true,
              },
              {
                name: "edit",
                description: "What to edit",
                type: "STRING",
                required: true,
                choices: ["title", "content", "type", "thumbnail"],
              },
              {
                name: "value",
                description: "The value to edit to",
                type: "STRING",
                required: true,
              },
            ],
          },
          {
            name: "sudo",
            description: "Moderator utilities",
            type: "SUB_COMMAND_GROUP",
            options: [
              {
                name: "list",
                description: "List all suggestions",
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
                    name: "user",
                    description: "The user to list suggestions for",
                    type: "USER",
                  },
                ],
              },
              {
                name: "delete",
                description: "Delete a suggestion",
                type: "SUB_COMMAND",
                options: [
                  {
                    name: "id",
                    description: "The ID of the suggestion",
                    type: "STRING",
                    required: true,
                  },
                ],
              },
              {
                name: "purge",
                description:
                  "Purge suggestions from a user, from most recent to oldest",
                type: "SUB_COMMAND",
                options: [
                  {
                    name: "user",
                    description: "The user to purge suggestions from",
                    type: "USER",
                    required: true,
                  },
                  {
                    name: "amount",
                    description: "The amount of suggestions to purge",
                    type: "NUMBER",
                    required: true,
                  },
                ],
              },
              {
                name: "ban",
                description: "Ban a user from submitting suggestions",
                type: "SUB_COMMAND",
                options: [
                  {
                    name: "user",
                    description: "The user to ban",
                    type: "USER",
                    required: true,
                  },
                  {
                    name: "reason",
                    description: "The reason for banning",
                    type: "STRING",
                  },
                  {
                    name: "duration",
                    description: "The duration of the ban",
                    type: "STRING",
                  },
                ],
              },
              {
                name: "unban",
                description: "Unban a user from submitting suggestions",
                type: "SUB_COMMAND",
                options: [
                  {
                    name: "user",
                    description: "The user to unban",
                    type: "USER",
                    required: true,
                  },
                  {
                    name: "reason",
                    description: "The reason for unbanning",
                    type: "STRING",
                  },
                ],
              },
            ],
          },
        ],
      });
    } else {
      logger(`Slash command already deployed to ${guild.name}`);
    }
  });
};
