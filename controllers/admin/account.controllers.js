const express = require("express")
const AccountAdmin = require("../../models/account-admin.model")
const ForgotPassWord = require("../../models/forgot-password.model")
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const generateHelpers = require('../../helpers/generate.helper')
const mailHelper = require('../../helpers/mail.helper')




// Controller register
module.exports.register = async (req, res) => {
    res.render('admin/pages/register', { pageTitle: "Đăng Kí" })
}
module.exports.registerInitial = async (req, res) => {
    res.render('admin/pages/register-initial', { pageTitle: "Đăng Kí" })
}
module.exports.registerPost = async (req, res) => {
    console.log(req.body);
    const { fullName, email, password } = req.body;
    const existAccount = await AccountAdmin.findOne({
        email: email
    })
    if (existAccount) {
        res.json({
            code: "error",
            message: "Email đã tồn tại"
        })
        return;
    }
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    const newAccount = new AccountAdmin({
        fullname: fullName,
        email: email,
        password: hashedPassword,
        status: "initial"
    })
    await newAccount.save();
    res.json({
        code: "success",
        message: "Đăng kí thành công"
    });
}
// controllers login
module.exports.login = async (req, res) => {
    res.render('admin/pages/login', { pageTitle: "Đăng Nhập" })
}
module.exports.loginPost = async (req, res) => {
    console.log(req.body);
    const { email, password, rememberPassword } = req.body;
    const existAccount = await AccountAdmin.findOne({
        email: email
    })
    if (!existAccount) {
        res.json({
            code: "error",
            message: "Email khong tồn tại"
        })
        return;
    }
    const isPasswordValid = await bcrypt.compare(password, existAccount.password);
    if (!isPasswordValid) {
        res.json({
            code: "error",
            message: "Mat khau khong khop"
        });
        return;
    }
    if (existAccount.status != "active") {
        res.json({
            code: "error",
            message: "Tai khoan chua duoc kich hoat"
        });
        return;
    }
    const token = jwt.sign({
        id: existAccount.id,
        email: existAccount.email
    }, process.env.JWT_SECRET, {
        expiresIn: rememberPassword ? '30d' : '1d'
    });
    res.cookie("token", token, {
        maxAge: rememberPassword ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: 'strict'
    })
    res.json({
        code: "success",
        message: "Đăng nhập thành công"
    });
}
// controller logout
module.exports.logout = async (req, res) => {
    res.clearCookie("token");
    res.json({
        code: "success",
        message: "Dang xuat thanh cong"
    })
}
//controller fixpassword
module.exports.forgotPassword = async (req, res) => {

    res.render('admin/pages/forgot-password', { pageTitle: "Quen mat khau" })
}

module.exports.forgotPasswordPost = async (req, res) => {
    const { email } = req.body;
    const existAccount = await AccountAdmin.findOne({ email: email })
    if (!existAccount) {
        res.json({
            code: "error",
            message: "Email khong ton tai"
        })
        return;
    }
    const existEmailForgotPassword = await ForgotPassWord.findOne({ email: email })
    if (existEmailForgotPassword) {
        const time = existEmailForgotPassword.expriesAt - Date.now();
        res.json({
            code: "error",
            message: `Vui long gui lai yeu cau sau ${Math.ceil(time / 1000)} giây`
        })
        return;
    }
    const otp = generateHelpers.generateRandomNumber(6);
    const newRecored = new ForgotPassWord({ email: email, otp: otp, expriesAt: Date.now() + 5 * 60 * 1000 })
    await newRecored.save();
    const subject = "Mã OTP TravelLightNing"
    const content = `Mã OTP của bạn là <b style="color: blue;">${otp}</b>. Mã có hiệu lực trong vòng 5 phút, tuyệt đối không chia sẻ mã này cho bất kì ai`;
    mailHelper.sendMail(email, subject, content)
    res.json({
        code: "success",
        message: `Da gui ma OTP`
    })


}
module.exports.otpPassword = async (req, res) => {
    res.render('admin/pages/otp-password', { pageTitle: "Quen mat khau" })
}
module.exports.otpPasswordPost = async (req, res) => {
    const { otp, email } = req.body;
    const existEmailForgotPassword = await ForgotPassWord.findOne({
        email: email,
        otp: otp
    })
    if (!existEmailForgotPassword) {
        res.json({
            code: "error",
            message: "Mã xác thục sai"
        })
        return;
    }
    const account = await AccountAdmin.findOne({
        email: email
    })
    const token = jwt.sign({
        id: account.id,
        email: account.email
    }, process.env.JWT_SECRET, {
        expiresIn: '1d'
    });
    res.cookie("token", token, {
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: 'strict'
    });
    await ForgotPassWord.deleteOne({ email: email });
    res.json({
        code: "success",
        message: "Xác thực thành công"
    })
}
module.exports.resetPassword = async (req, res) => {
    res.render('admin/pages/reset-password', { pageTitle: "Quen mat khau" })
}
module.exports.resetPasswordPost = async (req, res) => {
    const { password } = req.body;
    const account = res.locals.account;

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    await AccountAdmin.updateOne(
        { _id: account.id },
        { password: hashedPassword }
    );

    res.json({
        code: "success",
        message: "Thay đổi mật khẩu thành công"
    });
};