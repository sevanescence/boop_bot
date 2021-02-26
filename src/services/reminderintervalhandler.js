const Discord = require("discord.js");
const { firestore } = require("firebase-admin");

var taskId = -1;

/** 
 * @param {Discord.Client} client 
 * @param {firestore.QueryDocumentSnapshot<FirebaseFirestore.DocumentData>} user
 * @param {firestore.CollectionReference<firestore.DocumentData>} collection
 */
async function remindUser(client, user, collection) {
    /** @type {Discord.TextChannel} */
    let channel;
    let userdata = { id: "", time: 0, msg: "", channel: "" }

    if (collection) {
        for (let key of Object.keys(user.data()))
            userdata[key] = user.data()[key];
        collection.doc(user.id).delete();
    } else {
        userdata = user;
    }

    channel = client.channels.resolve(userdata.channel);
    await channel.send(`Reminder for <@${userdata.id}>: ${userdata.msg}`);
}

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
            if (user.get('id')) remindUser(client, user, col);
        });
    }, 30000);
    
    console.log('Reminder task running every 30 seconds.');
}

module.exports = {
    initReminderInterval: initReminderInterval,
    taskId: taskId,
    remindUser: remindUser,
}