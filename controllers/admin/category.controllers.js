const Category = require("../../models/category.model")
const AccountAdmin = require("../../models/account-admin.model")
const categoryHelper = require("../../helpers/category.helper")
const moment = require("moment")
const { pathAdmin } = require("../../config/variable")
module.exports.list = async (req, res) => {
    const categoryList = await Category.find({
        deleted: false
    }).sort({
        position: "asc"
    })

    for (const item of categoryList) {
        if (item.createdBy) {
            const createdByFullName = await AccountAdmin.findOne({ _id: item.createdBy })
            item.createdByFullName = createdByFullName.fullname;

        }
        if (item.updatedBy) {
            const updatedByFullName = await AccountAdmin.findOne({ _id: item.updatedBy })
            item.updatedByFullName = updatedByFullName.fullname;
        }
        item.createdAtFormat = moment(item.createdAt).format("HH:mm - DD/MM/YYYY")
        item.updateAtFormat = moment(item.updateAt).format("HH:mm - DD/MM/YYYY")

    }

    res.render('admin/pages/category-list', {
        categoryList: categoryList,
    })

}



module.exports.create = async (req, res) => {
    const categoryList = await Category.find({
        deleted: false
    })
    const categoryTree = categoryHelper.buildCategoryTree(categoryList);
    res.render('admin/pages/category-create', {
        categoryList: categoryTree
    })
}
module.exports.createPost = async (req, res) => {
    if (req.body.position) {
        req.body.position = parseInt(req.body.position);
    } else {
        const total = await Category.countDocuments({});
        req.body.position = total + 1;

    }
    req.body.createdBy = req.account.id;
    req.body.updatedBy = req.account.id;
    req.body.avatar = req.file ? req.file.path : "";
    const newRecord = new Category(
        req.body
    )


    await newRecord.save();
    req.flash(
        "success", " Tạo danh mục thành công"
    )
    res.json({
        code: "success",
        message: "Tao danh muc thanh cong"
    })
}
module.exports.edit = async (req, res) => {
    try {
        const categoryList = await Category.find({
            deleted: false
        })
        const id = req.params.id;
        const categoryEdit = await Category.findOne({
            _id: id,
            deleted: false
        })


        const categoryTree = categoryHelper.buildCategoryTree(categoryList);
        res.render('admin/pages/category-edit', {
            categoryList: categoryTree,
            categoryDetail: categoryEdit
        })
    }
    catch (err) {
        res.redirect(`/${pathAdmin}/category/list`)
    }
}
module.exports.editPatch = async (req, res) => {
    try {
        const id = req.params.id;
        console.log(req.body)
        req.body.updatedBy = req.account.id;
        if (req.file) {
            req.body.avatar = req.file.path
        }
        else { delete req.body.avatar };
        const categoryEdited = req.body;
        const result = await Category.updateOne({ _id: id, deleted: false }, categoryEdited)

        if (result.matchedCount === 0) {
            return res.redirect(`/${pathAdmin}/category/list`)
        }

        req.flash(
            "success", " Cập nhật danh mục thành công"
        )
        res.json({
            code: "success",
            message: "Cập nhật danh muc thanh cong"
        })
    }
    catch (error) {
        res.json({
            code: "error",
            message: "ID khong hop le"
        })


    }
}