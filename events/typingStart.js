const { Events } = require('discord.js');

module.exports = {
    name: Events.TypingStart,
    async execute(channel, user) {
        await channel.sendMessage(user + " is typing")
    },
};