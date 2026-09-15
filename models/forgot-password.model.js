const mongoose = require('mongoose');
const schema = new mongoose.Schema({

    email: String,
    otp: String,
    expriesAt: {
        type: Date,
        expires: 0
    }

}, {
    timestamps: true
}
);
const ForgotPassword = mongoose.model('ForgotPassWord', schema, 'forgot-password')
module.exports = ForgotPassword;