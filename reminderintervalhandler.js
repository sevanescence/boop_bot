const Discord = require("discord.js");
const { firestore } = require("firebase-admin");

var taskId = -1;

/** @param {Discord.Client} client */
function initReminderInterval(client) {
    console.log('Initializing reminder task...');
    if (taskId != -1) {
        throw 'InstanceError: Reminder interval task is already initialized.';
    }

    taskId = setInterval(async () => {
        let col = firestore().collection('remind_users');
        let users = await col.get();
        users.docs.map(async user => {
            if (parseInt(user.get('time')) < Date.now()) {
                /** @type {Discord.TextChannel} */
                let channel = client.channels.resolve(user.get('channel'));
                await channel.send(`Reminder for <@${user.get('id')}>: ${user.get('msg')}`);
                await col.doc(user.get('id')).delete();
                console.log(`${user.get('id')} removed from firestore.`);
            }
        });
    }, 30000);
    
    console.log('Reminder task running every 30 seconds.');
}

module.exports = {
    initReminderInterval: initReminderInterval,
    taskId: taskId
}