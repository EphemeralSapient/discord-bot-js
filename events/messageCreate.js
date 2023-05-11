const { Events } = require('discord.js');
require('dotenv').config();

module.exports = {
    name: Events.MessageCreate,
    async execute(message) {
        if (message.author.id == process.env.clientId) return;

        let msg = String(message.content);
        let lmsg = msg.toLowerCase();

        if (lmsg.includes("uwu")) await message.channel.send("FUCCCCCCCCK");

        console.log(message);
        await message.channel.send(`message : ${message}`);
    },
};

let a = "hi";
a.toLowerCase