const Discord = require('discord.js');
const client = new Discord.Client();
require('dotenv').config();
const path = require('path');
const fs = require('fs');

const firebase = require('./services/firebase');
const reminder = require('./services/reminderintervalhandler');

const { CommandHandler } = require('./command/commandhandler');
const stringutils = require('./command/stringutils');
const commandHandler = new CommandHandler();

// command handler
client.on('message', message => {
    if (message.author.bot) return;

    if (message.content.match(/^\$b\s\S/)) {
        const commandExists = commandHandler.commandCall(message);
        if (! commandExists) {
            message.channel.send(`\`${message.content}\` is not a valid command :T \`$b help\``);
        }
    }
})

// when client logs in
client.once('ready', () => {
    firebase.initFirestore();
    reminder.initReminderInterval(client);
    commandHandler.init(client);

    console.log(`${client.user.username}#${client.user.discriminator} is online! Here's a list of servers I'm in:`);

    const guilds = client.guilds.cache;
    let str;
    for (let guild of guilds) {
        str = `${guild[0]} - ${guild[1].name}`;
        console.log(str);
    }
});

client.login(process.env.TOKEN);