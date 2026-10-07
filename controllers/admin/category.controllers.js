const Category = require("../../models/category.model")
const AccountAdmin = require("../../models/account-admin.model")
const categoryHelper = require("../../helpers/category.helper")
const moment = require("moment")
const slugify = require('slugify')

const { pathAdmin } = require("../../config/variable")
module.exports.list = async (req, res) => {
    const accountAdmin = await AccountAdmin.find({}).select("_id fullname")
    console.log(accountAdmin)

    const find = {
        deleted: false
    }
    if (req.query.status) {
        find.status = req.query.status
    }
    if (req.query.createdBy) {
        find.createdBy = req.query.createdBy
    }
    const dateFilter = {};
    // lọc theo ngày tạo 
    if (req.query.startDate) {
        const startDate = moment(req.query.startDate).startOf("date").toDate();
        dateFilter.$gte = startDate


    }
    if (req.query.endDate) {
        const endDate = moment(req.query.endDate).endOf("date").toDate();
        dateFilter.$lte = endDate


    }
    // phan trang
    const limit = 2;
    let page = 1;
    if (req.query.page) {
        const currentpage = parseInt(req.query.page)
        if (currentpage > 0) {
            page = currentpage;
        }
    }
    const skip = (page - 1) * limit;
    const totalRecord = await Category.countDocuments(find);
    const totalPage = Math.ceil(totalRecord / limit)
    if (page > totalPage) {
        page = totalPage;
    }
    const pagination = {
        skip: skip,
        totalRecord: totalRecord,
        totalPage: totalPage,

    }

    // Tim kiem
    if (req.query.keyword) {
        const keyword = slugify(req.query.keyword, { lower: true });
        const keywordRegex = new RegExp(keyword)
        find.slug = keywordRegex
    }
    if (Object.keys(dateFilter).length > 0) {
        find.createdAt = dateFilter;
    }
    const categoryList = await Category
        .find(find)
        .sort({
            position: "asc"
        })
        .skip(skip)
        .limit(limit)

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
        item.updatedAtFormat = moment(item.updatedAt).format("HH:mm - DD/MM/YYYY")

    }


    res.render('admin/pages/category-list', {
        categoryList: categoryList,
        accountAdminList: accountAdmin,
        pagination: pagination
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
module.exports.deletePatch = async (req, res) => {
    try {
        const id = req.params.id;

        const deletedBy = req.account.id;


        const result = await Category.updateOne({ _id: id, deleted: false }, {
            deleted: true,
            deletedBy: deletedBy,
            deletaAt: Date.now()
        })

        if (result.matchedCount === 0) {
            return res.redirect(`/${pathAdmin}/category/list`)
        }

        req.flash(
            "success", " Xoa danh muc thành công"
        )
        res.json({
            code: "success",
            message: "Xoa danh muc thanh cong"
        })
    }
    catch (error) {
        res.json({
            code: "error",
            message: "ID khong hop le"
        })


    }
}
module.exports.changeMultiPatch = async (req, res) => {
    try {
        const option = req.body.option;
        const ids = req.body.ids;

        switch (option) {
            case "active":
            case "inactive":
                await Category.updateMany(
                    { _id: { $in: ids } },
                    {
                        status: option,
                        updatedBy: req.account.id
                    }
                );
                break;

            case "delete":
                await Category.updateMany(
                    { _id: { $in: ids } },
                    {
                        deleted: true,
                        deletedBy: req.account.id,
                        deletedAt: Date.now()
                    }
                );
                break;

            default:
                return res.json({
                    code: "error",
                    message: "Hành động không hợp lệ!"
                });
        }

        req.flash("success", "Cập nhật trạng thái thành công!");
        res.json({
            code: "success",
            message: "Cập nhật thành công!"
        });
    } catch (err) {
        res.json({
            code: "error",
            message: "Đã có lỗi xảy ra, vui lòng thử lại!"
        });
    }
};
