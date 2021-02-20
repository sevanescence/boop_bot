const Discord = require('discord.js');

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
  help: message => {
    // #27ace6
    message.channel.send({
      embed: {
        color: 0x27ace6,
        title: 'Boop Bot Commands',
        fields: [
          {
            name: '$b q <text> - Ask a question!', value: '_ _'
          },
          {
            name: '$b boop - *boop!*', value: '_ _'
          }
        ]
      }
    });
  }
}

module.exports = commands;