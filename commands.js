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
 *  @return {Array<String>} */
const splitArgs = (string, len) => {
    return string.replace(/^\$b\s.+?(\s|$)/, '').split(/\s/, len);
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
            }
            return 's';
        })();
        let durationMillis = parseInt(args[0].match(numRegex)[0] * parseInt(remind.timeAliases[alias]));

        const row = {
            id: message.author.id,
            time: Date.now() + durationMillis,
            msg: args[1],
            channel: message.channel.id
        }

        var exists = false;
        firestore().collection('remind_users').doc(row.id).get().then(data => {
            exists = !!data.data();
            if (exists && parseInt(data?.get('time')) < Date.now()) {
                exists = false;
            } else if (exists) {
                message.channel.send(`<@${row.id}>, you already have a reminder set! (multiple-reminders not yet implemented)`)
            }
        }).then(() => {
            if (! exists) firestore().collection('remind_users').doc(row.id).set(row).then(() => {
                message.channel.send(`Remind <@${row.id}> in ${args[0]} - ${args[1]}`);
            }).catch(err => {
                console.log(err);
                message.channel.send('An error occured in the console...');
            });
        });

        
    },

    /** @type {Function} @param {Discord.Message} message */
    help: message => {
        // #27ace6
        message.channel.send({
            embed: {
                color: 0x27ace6,
                title: 'Boop Bot Commands',
                fields: [ {
                        name: '$b q <text> - Ask a question!', value: '_ _'
                    }, {
                        name: '$b boop - *boop!*', value: '_ _'
                    }
                ],
            },
        });
    }
}

module.exports = commands;