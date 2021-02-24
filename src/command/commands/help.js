const Discord = require('discord.js');
const { CommandExecutor } = require('../commandhandler');
const stringutils = require('../stringutils');

const command = new CommandExecutor();

command.setCommandExecutor(message => {
    // 0x27ace6
    let embed = new Discord.MessageEmbed();
    embed.color = 0x27ace6;
    embed.title = "Boop Bot Commands";
    embed.description = 
        correctMultiLineString(
            `\`\`\`sh
            $b q <text> - Ask a question!
            $b boop - *boop!*
            $b remind <number>[(s|m|h|d)] <text> - Set a reminder
                example: $b remind 2h Clean the litter box.
            $b printme - print this function!
            \`\`\``
        );
    embed.footer = { text: 'Bot by MakotoMiyamoto#0125 https://github.com/MakotoMiyamoto/boop_bot', 
    iconURL: 'https://cdn.discordapp.com/avatars/410666964458012673/78e21bb764e4235f486079b4f1e06e1b.webp?size=256' };
    message.channel.send(embed);
});

command.setCommandFallback(message => {

});

module.exports = command;