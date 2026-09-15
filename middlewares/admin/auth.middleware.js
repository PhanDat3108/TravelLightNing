const { pathAdmin } = require("../../config/variable");
const jwt= require("jsonwebtoken");
const AccountAdmin = require("../../models/account-admin.model");

module.exports.verifyToken = async (req, res, next) => {
try
{
    const token = req.cookies.token;
    if (!token) {
        return res.redirect(`/${pathAdmin}/account/login`);
    }
    const decoded= jwt.verify(token,process.env.JWT_SECRET)
    const {id,email}=decoded;
    const existAccount= await AccountAdmin.findOne({
        _id: id,
        email:email,
        status: 'active'

    })
    if(!existAccount){
        res.clearCookie('token');
        return res.redirect(`/${pathAdmin}/account/login`)
    }
    res.locals.account = existAccount;
    req.account = existAccount;
    next();
}
catch(error){
     res.clearCookie('token');
        return res.redirect(`/${pathAdmin}/account/login`)
}
} 