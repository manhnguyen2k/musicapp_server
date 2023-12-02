// Import Firebase Admin SDK
const admin = require('firebase-admin');
//const firebase = require('firebase')
// Đường dẫn đến tệp JSON chứa thông tin xác thực của Firebase Admin SDK
const serviceAccount = require('../testapp-d6db9-firebase-adminsdk-vahn1-baccef8292.json');

// Khởi tạo ứng dụng Firebase Admin

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const auth = admin.auth();
console.log(auth.auth)
// Lấy tham chiếu đến Firestore
const db = admin.firestore();

// Kiểm tra kết nối
db.collection('exampleCollection').get()
  .then(snapshot => {
    console.log('Kết nối thành công!');
  })
  .catch(error => {
    console.error('Lỗi kết nối:', error);
  });

// Xuất đối tượng Firestore để sử dụng ở nơi khác trong ứng dụng
module.exports = {db,auth};
