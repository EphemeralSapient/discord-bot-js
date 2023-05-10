const { SlashCommandBuilder } = require('discord.js');
const { exec } = require('child_process');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('refresh')
        .setDescription('Bot will refresh'),
    async execute(interaction) {
        await interaction.deferReply();
        exec('git pull', async(error, stdout, stderr) => {
            if (error) {
                console.error(`exec error: ${error}`);
                return;
            }
            console.log(`stdout: ${stdout}`);
            console.error(`stderr: ${stderr}`);
            await interaction.editReply('Bot has been refreshed!');
        });
    },
};