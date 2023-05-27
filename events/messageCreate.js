const { Events } = require('discord.js')
const wait = require('node:timers/promises').setTimeout;

require('dotenv').config()

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
        var bot = global.bot;
        if (message.author.id == process.env.clientId || message.bot) return;

        let msg = String(message.content).replace('"', "'")
        let lmsg = msg.toLowerCase()
        let withoutMentionsMsg = lmsg.replace(/<@\d+>/g, "")

        // Mentions check and notify the user when online.
        if (withoutMentionsMsg != lmsg) {
            // Message contains mention
            if (global["debug_mention"] == "true") {
                let mentionIDs = lmsg.match(/<@(\d+)>/g).map(mention => mention.replace(/<@(\d+)>/g, '$1'));
                await message.channel.send(String(mentionIDs.length) + " mentions : " + mentionIDs)
            }
        }

        // CAT!!!
        if (lmsg == "cat") {
            await message.channel.sendTyping()
            let url = String(await global.generateCat());
            await message.channel.send(url);
        }

        // Brain works
        if (msg.includes(`<@1099527855643316284>`) || (message.mentions && message.mentions.repliedUser && message.mentions.repliedUser.id == '1099527855643316284')) {
            message.channel.sendTyping()
            await global.sendMessage(`${await global.bot.ask("My username is '" + message.author.username + "'." + withoutMentionsMsg, "id")}`, message.channel)
        }
        if (global.chatReadAI_state && (withoutMentionsMsg.includes("semp.js") || withoutMentionsMsg.includes("semp ai") || withoutMentionsMsg.includes("semppy") || withoutMentionsMsg.includes("semp js"))) {
            message.channel.sendTyping()
            let verify = String(await global.bot.ask(`consider yourself as "semp.js" and your creator name is "semp" now read this message "${lmsg}" sent by user "${message.author.username}". Give me your response`))
            verify = verify.slice(verify.indexOf(".") + 1).trim()
            if (verify.length != 0) {
                await global.sendMessage(verify, message.channel)
            }
        }

        // HATE THE F##KING UWU
        if (lmsg.includes("uwu")) await global.sendMessage(uwuStop[Math.floor(Math.random() * uwuStop.length)], message.channel)
            // AKINE? SCREW IT
        if (message.author.id == 576663196186837003 && lmsg.includes("uwu")) await global.sendMessage("<@576663196186837003> UWU????????????????????????", message.channel)

        if (lmsg.includes("https://tenor.com/view/hug-anime-cute-gif-25588757")) {
            await global.sendMessage(`<@${message.author.id}> WANT TO HUG? I WILL HUG YOU! LOOK AT ME, MY EYES https://cdn.discordapp.com/attachments/1086613044429324309/1106219756459147425/image.png`, message.channel)
            await message.delete()
        }

        // console.log(message)
        if (global["debug_message"] == "true")
            await global.sendMessage(`message : ${message}`, message.channel)
    },
};