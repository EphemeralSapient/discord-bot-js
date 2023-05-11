const { Events } = require('discord.js');
require('dotenv').config();

const uwuStop = [
    "https://i.pinimg.com/736x/56/4c/86/564c86edfca94adcd713120dcd630bdb.jpg",
    "https://cdn.discordapp.com/attachments/1086613044429324309/1106210805411762297/avatars-DiioKOwRdAbVLXTA-LuxClw-t500x500.png",
    "https://i.redd.it/xa8cqdtatbc41.jpg",
    "https://i.pinimg.com/originals/6e/c2/a1/6ec2a17d56335388b2f928b3c3976c4a.jpg",
    "https://cdn.discordapp.com/attachments/1086613044429324309/1106211712274808882/image.png"
];

module.exports = {
    name: Events.MessageCreate,
    async execute(message) {
        if (message.author.id == process.env.clientId) return;

        let msg = String(message.content);
        let lmsg = msg.toLowerCase();

        // HATE THE F##KING UWU
        if (lmsg.includes("uwu")) await message.channel.send(uwuStop[Math.floor(Math.random() * uwuStop.length)]);
        // AKINE? SCREW IT
        if (message.author.id == 576663196186837003 && lmsg.includes("uwu")) await message.channel.send("<@576663196186837003> UWU????????????????????????");

        if (lmsg.includes("https://tenor.com/view/hug-anime-cute-gif-25588757")) await message.channel.send("What the fuck shall I do, master?");

        console.log(message);
        //await message.channel.send(`message : ${message}`);
    },
};

let a = "hi";
a.toLowerCase