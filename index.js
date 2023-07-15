require('dotenv').config();

const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, GatewayIntentBits, IntentsBitField } = require('discord.js');
const token = process.env.token;
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildPresences, GatewayIntentBits.GuildMessageTyping, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessageReactions] });
const keep_alive = require('./keep_alive.js');
const { error } = require('node:console');

// Acceptable commands stored as collections.

client.commands = new Collection();

const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

// Going through the folders in the commands directory and looking for subfolders for .js files

for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
        } else {
            console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }
}

// These are meant for execution on specific events found on events directory

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        console.log(event.name);
        client.on(event.name, (...args) => event.execute(...args));
    }
}

// Updating the fast flag values from json file
const fFlagData = JSON.parse(fs.readFileSync('fastFlags.json'));
for (const key in fFlagData) {
    if (fFlagData.hasOwnProperty(key)) {
        const value = fFlagData[key];
        // Use the key and value as needed
        console.log(`Key: ${key}, Value: ${value}`);
        global[key] = value;
    }
}
// Loading the AI Bots

global.chatReadAI_state = false

import ("googlebard").then(async(googlebard) => {
    let bot = new googlebard.Bard(process.env.BARD_ACCESS_TOKEN);
    global.googlebard = bot
    let repl = await bot.ask("Hello there!")
    console.log("BARD : " + repl)
    global.chatReadAI_state = true
    return bot
}).then((response) => {
    console.log("Connected to googlebard")
}).catch((error) => {
    console.error(error)
})

import ("chatgpt").then(async(chatgpt) => {
    let api = new chatgpt.ChatGPTAPI ({
        apiKey: process.env.OPENAI_ACCESS_TOKEN,
        //apiReverseProxyUrl: "https://ai.fakeopen.com/api/conversation"
    })

    // let reponse = await api.sendMessage("hello")
    // console.log("ChatGPT : " + reponse.text)
    global.chatGpt = api
}).then((response) => {
    console.log("Connected to chatgpt")
}).catch((error) => {
    console.error(error)
})

import ("bing-chat").then(async(BingChat) => {
    let api = new BingChat.BingChat({
        cookie: process.env.BING_ACCESS_TOKEN
    })

    global.bingApi = api

    const res = await api.sendMessage('Hello World!')

    global.bingContext = res

    console.log("BING :" + res.text)
}).then((response) => {
    console.log("Connected to bing chat");
}).catch((error) => {
    console.error(error)
});

// Setting the global functions

global.sendMessage = async(messageString, channel) => {
    const chunkSize = 1500;
    const chunks = [];

    if (channel == null) {
        channel = global["defaultChannel"];
    }

    for (let i = 0; i < messageString.length; i += chunkSize) {
        chunks.push(messageString.substring(i, i + chunkSize));
    }

    chunks.forEach(async(chunk) => {
        await channel.send(chunk);
    });
};

global.getFFlag = (name) => {
    const fastFlagsFile = 'fastFlags.json';
    const fastFlagsData = JSON.parse(fs.readFileSync(fastFlagsFile));
    return fastFlagsData[name]
}

global.setFFlag = (name, value) => {
    const fastFlagsFile = 'fastFlags.json';
    const fastFlagsData = JSON.parse(fs.readFileSync(fastFlagsFile));
    let oldValue = fastFlagsData[name] || "NULL";
    fastFlagsData[name] = value;
    fs.writeFileSync(fastFlagsFile, JSON.stringify(fastFlagsData, null, 4));
    return oldValue;
}

global.get = (name) => {
    const fastFlagsFile = 'temp.json';
    const fastFlagsData = JSON.parse(fs.readFileSync(fastFlagsFile));
    return fastFlagsData[name]
}

global.set = (name, value) => {
    const fastFlagsFile = 'temp.json';
    const fastFlagsData = JSON.parse(fs.readFileSync(fastFlagsFile));
    let oldValue = fastFlagsData[name] || "NULL";
    fastFlagsData[name] = value;
    fs.writeFileSync(fastFlagsFile, JSON.stringify(fastFlagsData, null, 4));
    return oldValue;
}

global.generateCat = async() => {
    try {
        const response = await fetch('https://api.thecatapi.com/v1/images/search?mime_types=gif', {
            headers: {
                'x-api-key': "live_XO0NiwPJmuxQzYcCdKmGl2UX1OSkdk7rizGtCIccQCC0fMYojU6tJ3vZWtOIEgFR"
            }
        });
        const data = await response.json();
        console.log(data);
        // Extract the image URL from the response
        return data[0].url;

    } catch (error) {
        return 'Error fetching cat image:';
    }
}

// Global variables

global.client = client;

// Error handling
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:');
    console.error(err);

    global.set("error", JSON.stringify(err));
});

// Start listening.

client.login(token);