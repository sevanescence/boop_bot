const Discord = require('discord.js');
const { firestore } = require('firebase-admin');
const firebase = require('firebase-admin');

const answers = {
    answerList: ['yes', 'no', 'maybe'],

    /** @type {Function} @return {String} */
    rollQuestion: () => {
        let roll = parseInt(Math.random() * 3);
        return answers.rollAnswer(answers.answerList[roll]);
    },

    /** @type {Function<VoidFunction>} @param {String} answer @return {String} */
    rollAnswer: answer => {
        /** @type {Array<String>} */
        let ans = answers[answer];
        return ans[parseInt(Math.random()*ans.length)];
    },

    yes:   ['Yes!',     'Mhm!',      '*nods*',           'Definitely'],
    no:    ['No',       'Nope',      '*shakes my head*', 'Not exactly'],
    maybe: ['Perhaps?', 'Uncertain', '*shrugs*',         'Maybe, maybe not?'],
}

const remind = {
    timeAliases: {
        s: 1000,
        m: 1000 * 60,
        h: 1000 * 60 * 60,
        d: 1000 * 60 * 60 * 24,
    },

}

/** 
 * @param {String} string 
 * @param {Number} len
 * @return {Array<String>} */
const splitArgs = (string, len) => {
    let args = string.replace(/^\$b\s.+?(\s|$)/, '').split(/\s/);
    for (let i = len; i < args.length; i++) {
        args[len-1] += ` ${args[i]}`;
    }
    for (let i = len; i < args.length; args.pop());
    console.log(args);
    return args;
}

/** @param {Array<String>} arr @return {String} smallest string from array */
const findSmallestString = arr => {
    let smallestString;
    for (let str of arr) {
        if (! smallestString || str < smallestString) {
            smallestString = str;
        }
    }
    return smallestString;
}

/** @param {String} str @return {String} */
const correctMultiLineString = str => {
    let arr = str.match(/(?<=\n)\s+/ig);
    let len = findSmallestString(arr).length;
    let regex = new RegExp(`\\s{${len}}(?=\\S)`, 'g');
    return str.replace(regex, '');
}

const commands = {
    /** @type {Function} @param {Discord.Message} message */
    q: message => {
        if (message.content.match(/(?<!un)cute/)) {
            message.channel.send('Of course!');
            return;
        }
        message.channel.send(answers.rollQuestion());
    },

    /** @type {Function} @param {Discord.Message} message */
    boop: message => {
        message.channel.send('*boop*')
    },

    /** @type {Function} @param {Discord.Message} message */
    remind: message => {
        const args = splitArgs(message.content, 2);

        if (args.length < 2) {
            message.channel.send('Argument must have at least two arguments.\nExample: `$b remind 2h clean the litter box.`');
            return;
        }

        const numRegex = new RegExp(/(\d|\.)+?(?=[^0-9.]|$)/g);
        const alsRegex = new RegExp(/[A-z]/g);

        if (! args[0].match(numRegex)) {
            message.channel.send('First argument must be a timestamp.\nExample: `$b remind 2h clean the litter box.`');
            return;
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
            return;
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

        
    },

    /** @param {Discord.Message} message */
    printme: message => {
        let str = correctMultiLineString(`\`\`\`js\n${commands.printme}\n\`\`\``);
        message.channel.send(str);
    },

    /** @type {Function} @param {Discord.Message} message */
    help: message => {
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
    }
}

module.exports = commands;