const Discord = require('discord.js');
const { CommandExecutor } = require('../commandhandler');

const command = new CommandExecutor();

command.setCommandExecutor(message => {
    if (message.content.match(/beep/i)) {
        return false;
    }

    message.channel.send('*Boop!*');
    return true;
});

command.setCommandFallback(message => {
    message.channel.send('*Beep!*');
})

module.exports = command;
