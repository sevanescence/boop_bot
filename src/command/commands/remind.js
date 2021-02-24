const Discord = require('discord.js');
const { CommandExecutor } = require('../commandhandler');
const firebase = require('firebase-admin');
const { firestore } = require('firebase-admin');
const stringutils = require('../stringutils');

const command = new CommandExecutor();

const remind = {
    timeAliases: {
        s: 1000,
        m: 1000 * 60,
        h: 1000 * 60 * 60,
        d: 1000 * 60 * 60 * 24,
    },

}

command.setCommandExecutor(message => {
    const args = stringutils.splitArgs(message.content, 2);

    if (args.length < 2) {
        message.channel.send('Argument must have at least two arguments.\nExample: `$b remind 2h clean the litter box.`');
        return true;
    }

    const numRegex = new RegExp(/(\d|\.)+?(?=[^0-9.]|$)/g);
    const alsRegex = new RegExp(/[A-z]/g);

    if (! args[0].match(numRegex)) {
        message.channel.send('First argument must be a timestamp.\nExample: `$b remind 2h clean the litter box.`');
        return true;
    }

    let alias = (() => {
        const key = args[0].match(alsRegex)?.[0] || 'NoKeyProvided';
        if (remind.timeAliases[key]) {
            return key;
        } else if (key !== 'NoKeyProvided') {
            return 'InvalidKey';
        }
        return 's';
    })();
    if (alias === 'InvalidKey') {
        let embed = new Discord.MessageEmbed();
        embed.color = 0x27ace6;
        embed.title = "Invalid alias for `$b remind`!";
        embed.description = "Available aliases are: `s, m, h, d`";
        message.channel.send(embed);
        return true;
    }

    let durationMillis = parseInt(args[0].match(numRegex)[0] * parseInt(remind.timeAliases[alias]));

    const row = {
        id: message.author.id,
        time: Date.now() + durationMillis,
        msg: args[1],
        channel: message.channel.id
    }

    var exists = false;
    firestore().collection('remind_users').doc(row.id).get().then(user => {
        exists = !!user.data();
        if (exists && parseInt(user?.get('time')) < Date.now()) {
            exists = false;
        } else if (exists) {
            message.channel.send(`<@${row.id}>, you already have a reminder set! (multiple-reminders not yet implemented)`)
        }
    }).then(() => {
        if (! exists) firestore().collection('remind_users').doc(row.id).set(row).then(() => {
            message.channel.send(`Remind <@${row.id}> in ${args[0]}${(() => { if (args[0].match(/(\d|\.)$/)) return 's'; else return '' })()} - ${args[1]}`);
        }).catch(err => {
            console.log(err);
            message.channel.send('An error occured in the console...');
        });
    });

    return true;
});

command.setCommandFallback(message => {

});

module.exports = command;