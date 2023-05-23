require('dotenv').config();

const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, GatewayIntentBits } = require('discord.js');
const token = process.env.token;
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildPresences, GatewayIntentBits.GuildMessageTyping] });
const keep_alive = require('./keep_alive.js');

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

// Loading the AI Bots

global.chatReadAI_state = false

import ("googlebard").then(async(googlebard) => {
    let bot = new googlebard.Bard(`__Secure-1PSID=WQjLmTUg2YMOQE9fS1DhkqvCPsVS8DJx12GqmQuN-siy386-Uj_skByNYdE4hpOQjsNVdg.`);
    global.bot = bot
    let repl = await bot.ask("Hello there!")
    console.log("BARD : " + repl)
    global.chatReadAI_state = true
    return bot
}).then((response) => {
    console.log("Connected to googlebard")
}).catch((error) => {
    console.error(error)
})

import ("bing-chat").then(async(BingChat) => {
    let api = new BingChat.BingChat({
        cookie: "1X176K581eBUDWuLSgcEdF-47noxkii7UbCknv9b7_uYxmYjtQPYf_MUbNyAsIgvGpE2wGqXgssY6Rmbik_X9YRS0lW9ISI8rgCdlRpS5R0JWCNUOseK_BJN3ZGD6ouAMfyhPn0r_79ZumEL-SOesZ6InusUhq_x2umEVYMfbJLlJBXTGosSVoyhIbrGI5dA5InHwv3tFu9OWh6lacjQenFL3i9WzC44Rd-JOSnLBkSU"
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

    for (let i = 0; i < messageString.length; i += chunkSize) {
        chunks.push(messageString.substring(i, i + chunkSize));
    }

    chunks.forEach(async(chunk) => {
        await channel.send(chunk);
    });
};

global.generateCat = async() => {
    try {
        const response = await fetch('https://api.thecatapi.com/v1/images/search', {
            headers: {
                'x-api-key': "live_XO0NiwPJmuxQzYcCdKmGl2UX1OSkdk7rizGtCIccQCC0fMYojU6tJ3vZWtOIEgFR"
            }
        });
        const data = await response.json();

        // Extract the image URL from the response
        return data[0].url;

    } catch (error) {
        return 'Error fetching cat image:';
    }
}

// Enter your API key here
const apiKey = 'YOUR_API_KEY';

// Call the function to fetch a random cat image
getRandomCatImage(apiKey);



// Start listening.

client.login(token);