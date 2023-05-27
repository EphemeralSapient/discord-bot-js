const { Events } = require('discord.js');

module.exports = {
    name: Events.TypingStart,
    async execute(channel, user) {
        await channel.send(user + " is typing")
    },
};