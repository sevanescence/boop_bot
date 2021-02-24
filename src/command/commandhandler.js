const Discord = require('discord.js');
const stringutils = require('./stringutils');

const path = require('path');
const fs = require('fs');

/** @param {Discord.Message} message @return {Boolean} command execution success */
const executorTemplate = (message) => {}
/** @param {Discord.Message} message */
const fallbackTemplate = (message) => {}

class CommandExecutor {
    /** @type {executorTemplate} */
    executor;
    /** @type {fallbackTemplate} */
    fallback;

    constructor() {

    }

    /** @param {executorTemplate} executor */
    setCommandExecutor(executor) {
        this.executor = executor;
    }

    /** @param {fallbackTemplate} fallback */
    setCommandFallback(fallback) {
        this.fallback = fallback;
    }
}

class CommandHandler {
    /** @type {Discord.Client} */
    client;
    /** @type {Map<String, CommandExecutor>} */
    commands;

    /** @param {Discord.Client} client */
    constructor(client) {
        this.client = client;
        this.commands = new Map();
    }

    /** @param {Discord.Client} client */
    init(client) {
        this.client = client;

        console.log('Initializing commands...');

        const commandsDir = path.join(__dirname, 'commands');
        fs.readdir(commandsDir, (err, files) => {
            if (err) return console.log(err);

            files.forEach(file => {
                if (! file.match(/\.js$/)) return;

                const filepath = path.join(commandsDir, file);
                const js = require(filepath);
                this.addCommand(file.match(/.+?(?=\.js$)/)[0], js);
            });
        });

        console.log('Commands initialized.');
    }

    /** @param {Discord.Message} message @return {Boolean} command exists */
    commandCall(message) {
        const label = stringutils.getLabel(message.content);
        const command = this.commands.get(label);
        if (! (label || command)) {
            return false;
        }

        const commandExecutionSuccess = command.executor(message);
        if (! commandExecutionSuccess) {
            command.fallback?.(message);
        }

        return true;
    }

    /** 
     * @param {string} command command to be executed
     * @param {CommandExecutor} executor
     */
    addCommand(command, executor) {
        this.commands.set(command, executor);
    }
}

module.exports = {
    CommandHandler: CommandHandler,
    CommandExecutor: CommandExecutor
}