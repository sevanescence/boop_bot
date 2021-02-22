const Discord = require('discord.js');
const client = new Discord.Client();
require('dotenv').config();

const commands = require('./commands');
const firebase = require('./firebase');
const reminder = require('./reminderintervalhandler');

// command handler
client.on('message', message => {
    if (message.author.bot) return;

    if (message.content.match(/^\$b\s\S/)) {
    let args = message.content.split(/\s/);
    if (commands[args[1]]) {
        commands[args[1]](message);
        return;
    }
    message.channel.send(`\`${message.content}\` is not a valid command :T \`$b help\``);
    return;
    }
});

// when client logs in
client.once('ready', () => {
    firebase.initFirestore();
    reminder.initReminderInterval(client);

    console.log(`${client.user.username}#${client.user.discriminator} is online! Here's a list of servers I'm in:`);

    const guilds = client.guilds.cache;
    let str;
    for (let guild of guilds) {
        str = `${guild[0]} - ${guild[1].name}`;
        console.log(str);
    }
});

client.login(process.env.TOKEN);