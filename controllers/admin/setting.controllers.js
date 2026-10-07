
const moment = require("moment")
const slugify = require('slugify')
const { pathAdmin } = require("../../config/variable")
const SettingWebsiteInfo = require("../../models/setting-website.models")
const permissionListConfig = require("../../config/permission")
const Role = require("../../models/role.model");


module.exports.list = async (req, res) => {
    res.render('admin/pages/setting-list', {
        pageTitle: "Thong tin web site"
    })

}
module.exports.roleCreate = async (req, res) => {

    const permissionList = permissionListConfig.permissionList;
    res.render('admin/pages/setting-role-create', {
        pageTitle: "Thong tin web site",
        permissionList: permissionList
    })

}
module.exports.roleCreatePost = async (req, res) => {
    console.log(req.body);
    req.body.createdBy = req.account.id;

    req.body.updatedBy = req.account.id;


    const newRecord = new Role(req.body);
    await newRecord.save();


    req.flash("success", "Thanh cong")
    res.json({
        code: "success",
        message: " Tao role that bai"
    })

}
module.exports.websiteInfo = async (req, res) => {
    const settingWebsiteInfo = await SettingWebsiteInfo.findOne({}) || {};
    res.render('admin/pages/setting-website-info', {
        pageTitle: "Thong tin web site",

        settingWebsiteInfo: settingWebsiteInfo
    }
    )

}
module.exports.websiteInfoPatch = async (req, res) => {
    try {
        if (req.files && req.files.logo && req.files.logo.length > 0) {
            req.body.logo = req.files.logo[0].path;
        } else {
            delete req.body.logo;
        }

        if (req.files && req.files.favicon && req.files.favicon.length > 0) {
            req.body.favicon = req.files.favicon[0].path;
        } else {
            delete req.body.favicon;
        }

        const settingWebsiteInfo = await SettingWebsiteInfo.findOne({});
        console.log(req.body)
        if (settingWebsiteInfo) {
            await SettingWebsiteInfo.updateOne({
                _id: settingWebsiteInfo.id
            }, req.body);
        } else {
            const newRecord = new SettingWebsiteInfo(req.body);
            await newRecord.save();
        }

        req.flash("success", "Cập nhật thông tin website thành công!");
        res.json({
            code: "success",
            message: "Cập nhật thông tin web thành công"
        });
    } catch (error) {
        console.error(error);
        res.json({
            code: "error",
            message: "Cập nhật thất bại"
        });
    }
};
