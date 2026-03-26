const admin = require('firebase-admin');
const serviceAccount = require('./ra-masale-4bf7d-firebase-adminsdk-dgch1-0df1b63e73.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;
