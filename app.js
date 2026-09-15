const express = require('express');
const path = require('path')
const cookieParser = require('cookie-parser');
const app = express()
require ('dotenv').config();
const database= require('./config/database')
const variableConfig= require('./config/variable')

//ket noi database
database.connect();
const port = 3000
const adminRoutes= require('./routes/admin/index.route')
const clientRoutes = require('./routes/client/index.route')
// setup view làm thu mục chứa cái bên dao diện
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug');

// Khai báo các biến toàn cục cho toàn bộ trang web (tránh lỗi undefined ở view)
app.locals.settingWebsiteInfo = {
    favicon: "/assets/images/favicon.png",
    phone: "0123456789",
    email: "contact@example.com",
    address: "Hà Nội, Việt Nam",
    websiteName: "Travel Lightning",
    logo: "/assets/images/logo.png"
};
app.locals.messages = {}; // Chống lỗi messages.success
app.locals.categoryList = []; // Chống lỗi vòng lặp categoryList ở header
app.locals.account = { // Dữ liệu giả lập user đăng nhập
    avatar: "/admin/assets/images/avatar.jpg",
    fullName: "Quản trị viên",
    roleName: "Admin"
};
app.locals.permissions = [
    "dashboard-view",
    "category-view",
    "category-create",
    "tour-view",
    "tour-create",
    "tour-trash",
    "order-view",
    "user-view"
]; // Dữ liệu giả lập phân quyền để Sider hiện menu

app.use(express.static(path.join(__dirname, 'public')))
app.get('/', (req, res) => {
    res.render('client/pages/home.pug', { 
        pageTitle: "Trang chu doa e", // Đổi title thành pageTitle cho khớp giao diện
        tourListSection2: [], // Mảng rỗng chống lỗi ở section 2
        tourListSection4: []  // Mảng rỗng chống lỗi ở section 4
    })
})
app.locals.pathAdmin=variableConfig.pathAdmin;
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// Khởi tạo các route
app.use('/', clientRoutes);
app.use(`/${variableConfig.pathAdmin}`,adminRoutes)

global.pathAdmin= variableConfig.pathAdmin;

app.listen(port, () => {
    console.log(`http://localhost:${port}`)
})