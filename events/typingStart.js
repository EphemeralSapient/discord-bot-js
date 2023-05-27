const { Events } = require('discord.js');

module.exports = {
    name: Events.TypingStart,
    async execute(typing) {
        console.log(typing.channel);
    },
};