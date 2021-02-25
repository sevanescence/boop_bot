const admin = require('firebase-admin');

/** @type {FirebaseFirestore.Firestore} */
var firestore;

/** @return {VoidFunction} */
function initFirestore() {
    console.log('Connecting to Firestore...');

    const config = require('./serviceAccountKey.json');
    admin.initializeApp({
        credential: admin.credential.cert(config)
    });

    console.log('Connected to Firestore.');
    firestore = admin.firestore();
}

module.exports = {
    initFirestore: initFirestore,
    firestore: firestore
};
