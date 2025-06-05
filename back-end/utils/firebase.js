const admin = require('firebase-admin');
const serviceAccount = require('./accountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: ""
});

const db = admin.database();

module.exports = { admin, db };