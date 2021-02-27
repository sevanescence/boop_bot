console.log('Importing packages...')

const Discord = require('discord.js');
const client = new Discord.Client();
const env = require('dotenv');
const config = env.config();

const firebase = require('./services/firebase');
const reminder = require('./services/reminderintervalhandler');
const commandhandler = require('./command/commandhandler').commandhandler;

// command handler
client.on('message', message => {
    if (message.author.bot) return;

    if (message.content.match(/^\$b\s\S/)) {
        const commandExists = commandhandler.commandCall(message);
        if (! commandExists) {
            message.channel.send(`\`${message.content}\` is not a valid command :T \`$b help\``);
        }
    }
})

// when client logs in
client.once('ready', () => {
    firebase.initFirestore();
    reminder.initReminderInterval(client);
    commandhandler.init(client);

    console.log(`${client.user.username}#${client.user.discriminator} is online! Here's a list of servers I'm in:`);

    const guilds = client.guilds.cache;
    let str;
    for (let guild of guilds) {
        str = `${guild[0]} - ${guild[1].name}`;
        console.log(str);
    }
});

client.once('error', error => {
    console.log(`Error ${error.name}:\n${error.message}\n${error.stack || 'No stack trace available.'}`);
    client.destroy();
});

console.log('Establishing connection...')
client.login(process.env.TOKEN);