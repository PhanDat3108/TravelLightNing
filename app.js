const express = require('express');
const path = require('path')
const app = express()
require ('dotenv').config();
const database= require('./config/database')

//ket noi database
database.connect();
const port = 3000

const clientRoutes = require('./routes/client/index.routes')
// setup view làm thu mục chứa cái bên dao diện
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug');

app.use(express.static(path.join(__dirname, 'public')))
app.get('/', (req, res) => {
    res.render('client/pages/home.pug', { title: "Trang chu doa e" })
})

// Khởi tạo các route
app.use('/', clientRoutes);


app.listen(port, () => {
    console.log(`http://localhost:${port}`)
})