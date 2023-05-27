const { Events } = require('discord.js');

module.exports = {
    name: Events.TypingStart,
    async execute(channel, user) {
        console.log(`${user.tag} started typing in ${channel.name}`);
    },
};