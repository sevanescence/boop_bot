const Discord = require('discord.js');
const { CommandExecutor } = require('../commandhandler');

const command = new CommandExecutor();

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

command.setCommandExecutor(message => {
    if (message.content.match(/(?<!un)cute/)) {
        message.channel.send('Of course!');
        return true;
    }
    message.channel.send(answers.rollQuestion());
    return true;
});

command.setCommandFallback(message => {

});

module.exports = command;