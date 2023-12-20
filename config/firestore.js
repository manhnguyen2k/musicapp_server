const admin = require('firebase-admin');
const serviceAccount = require('../testapp-d6db9-firebase-adminsdk-vahn1-baccef8292.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const auth = admin.auth();
console.log(auth)
const db = admin.firestore();


db.collection('exampleCollection').get()
  .then(snapshot => {
    console.log('Kết nối thành công!');
  })
  .catch(error => {
    console.error('Lỗi kết nối:', error);
  });

module.exports = {db,auth};
