const { Events } = require('discord.js');
require('dotenv').config();

module.exports = {
    name: Events.MessageCreate,
    async execute(message) {
        if (message.author.id == process.env.clientId) return;

        console.log(message);
        //await message.channel.send(`message : ${message}`);
    },
};