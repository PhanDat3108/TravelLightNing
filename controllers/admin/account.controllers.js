const e = require("express")
const AccountAdmin = require("../../models/account-admin.model")
const bcrypt= require( "bcryptjs");



module.exports.login = async (req, res) => {
    res.render('admin/pages/login', { pageTitle: "Đăng Nhập" })
}
module.exports.register = async (req, res) => {
    res.render('admin/pages/register', { pageTitle: "Đăng Kí" })
}
module.exports.registerInitial = async (req, res) => {
    res.render('admin/pages/register-initial', { pageTitle: "Đăng Kí" })
}
module.exports.registerPost = async (req, res) => {
   console.log(req.body);
   const {fullName,email,password}=req.body;
   const existAccount= await AccountAdmin.findOne({
    email: email
   })
   if(existAccount){
    res.json({
        code:"error",
        message:"Email đã tồn tại"
    })
    return;
   }
   const salt = bcrypt.genSaltSync(10);
const hashedPassword = bcrypt.hashSync(password, salt);
   const newAccount= new AccountAdmin({
    fullname:fullName,
    email: email,
    password:hashedPassword,
    status: "initial"
   })
   await newAccount.save();
   res.json({
    code:"success",
    message:"Đăng kí thành công"
   });
}


module.exports.loginPost = async (req, res) => {
   console.log(req.body);
   const {email,password}=req.body;
   const existAccount= await AccountAdmin.findOne({
    email: email
   })
   if(!existAccount){
    res.json({
        code:"error",
        message:"Email khong tồn tại"
    })
    return;
   }
   const isPasswordValid= await bcrypt.compare(password,hash);
   if (!isPasswordValid){
    res.json({
        code:"error",
        message:"Mat khau khong khop"
    })
   }
   if (existAccount.status!="active"){
    res.json({
        code:"error",
        message:"Tai khoan chua duoc kich hoat"
    })
   }
   res.json({
    code:"success",
    message:"Đăng nhập thành công"
   });
}


module.exports.forgotPassword = async (req, res) => {
    res.render('admin/pages/forgot-password', { pageTitle: "Quen mat khau" })
}
module.exports.otpPassword = async (req, res) => {
    res.render('admin/pages/otp-password', { pageTitle: "Quen mat khau" })
}
module.exports.resetPassword = async (req, res) => {
    res.render('admin/pages/reset-password', { pageTitle: "Quen mat khau" })
}