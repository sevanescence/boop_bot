const Discord = require('discord.js');
const { CommandExecutor } = require('../commandhandler');

const path = require('path');
const fs = require('fs');

const command = new CommandExecutor();

command.setCommandExecutor(message => {
    const pathtofile = path.join(__dirname, 'printme.js');
    const filecontent = fs.readFileSync(pathtofile, 'utf8');
    
    message.channel.send(`\`\`\`js\n${filecontent}\n\`\`\``).then(() => {
        console.log('Someone requested this to be printed!');
    });
});

command.setCommandFallback(message => {

});

module.exports = command;