const { Events } = require('discord.js');

module.exports = {
    name: Events.MessageCreate,
    execute(message) {
        console.log(message);
        (async() => {
            await message.channel.send(`message : ${message.toString()}`);
        })();
    },
};