const path = require('path');
const express = require('express');
const https = require('https');
const http = require('http')
const fs = require('fs');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

// Đọc key và certificate từ file (đã tạo từ bước 1)


// Sử dụng middleware để đảm bảo tất cả các yêu cầu chuyển đổi sang HTTPS


// Sử dụng bodyParser middleware để xử lý các yêu cầu POST
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Page Home
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/index.html'));
});

// ZingMp3Router
const ZingMp3Router = require('./routers/api/ZingRouter');
app.use('/api', cors(), ZingMp3Router);

// Page Error
app.get('*', (req, res) => {
  res.send('Nhập Sai Đường Dẫn! Vui Lòng Nhập Lại >.<');
});
const options = { 
  key: fs.readFileSync("test.key"), 
  cert: fs.readFileSync("test.crt"), 
}; 

// Tạo server HTTPS
https.createServer(options, app) 
.listen(3000, function (req, res) { 
  console.log("Server started at port 3000"); 
});
