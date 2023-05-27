const fs = require('fs');
const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('fflag')
        .setDescription('fast flag for global function control')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addStringOption(option =>
            option.setName('name')
            .setDescription('the fast flag name')
            .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('value')
            .setDescription('the value for the given fast flag')
            .setRequired(true)
        ),
    async execute(interaction) {
        await interaction.editReply("Running the code...");

        // Get the code from the interaction's options
        const name = interaction.options.getString('name');
        const value = interaction.options.getString('value');

        try {
            // Update fastFlags.json with the new value
            let oldValue = global.setFFlag(name, value);
            await interaction.editReply("Changed the fast flag value | [ `" + name + "` ] " + oldValue + " >> " + value);
        } catch (error) {
            // Handle any errors
            console.log("FF Operation Error: " + error);
            await interaction.editReply("Failed to execute the operation | " + error);
        }
    },
};