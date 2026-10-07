const Tour = require("../../models/tour")
const helper = require("../../helpers/category.helper")
const Category = require("../../models/category.model")
const City = require("../../models/cities.model")
const AccountAdmin = require("../../models/account-admin.model")
const moment = require("moment")
const slugify = require('slugify')
const { pathAdmin } = require("../../config/variable")


module.exports.list = async (req, res) => {

    const accountAdmin = await AccountAdmin.find({}).select("_id fullname")
    const categoryList = await Category.find({
        deleted: false
    });
    const categoryTree = helper.buildCategoryTree(categoryList);
    console.log(categoryTree)

    const find = {
        deleted: false
    }
    if (req.query.createdBy) {
        find.createdBy = req.query.createdBy
    }
    if (req.query.status) {
        find.status = req.query.status
    }
    if (req.query.category) {
        find.category = req.query.category
    }
    if (req.query.keyword) {
        const keyword = slugify(req.query.keyword, { lower: true })
        const keywordRegex = new RegExp(keyword)
        find.slug = keywordRegex

    }
    const limit = 5;
    let page = 1;
    if (req.query.page) {
        const currentPage = parseInt(req.query.page)
        if (currentPage > 0) {
            page = currentPage;
        }
    }
    const skip = (page - 1) * limit
    const totalRecord = await Tour.countDocuments(find);
    const totalPage = Math.ceil(totalRecord / limit) || 1;
    if (page > totalPage) {
        page = totalPage;
    }
    const pagination = {
        skip: skip,
        totalPage: totalPage,
        totalRecord: totalRecord,
    }
    const dateFilter = {};

    if (req.query.startDate) {
        const startDate = moment(req.query.startDate).startOf("date").toDate();
        dateFilter.$gte = startDate


    }
    if (req.query.endDate) {
        const endDate = moment(req.query.endDate).endOf("date").toDate();
        dateFilter.$lte = endDate


    }
    if (req.query.price) {
        const [minPrice, maxPrice] = req.query.price.split("-");
        const priceFilter = {};
        if (minPrice) {
            priceFilter.$gte = parseInt(minPrice)
        }
        if (maxPrice) {
            priceFilter.$lte = parseInt(maxPrice)
        }
        find.priceAdult = priceFilter;

    }
    if (Object.keys(dateFilter).length > 0) {
        find.createdAt = dateFilter;
    }
    const tourList = await Tour
        .find(find)
        .sort({ position: "asc" })
        .skip(skip)
        .limit(limit);

    for (const item of tourList) {
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

    res.render('admin/pages/tour-list', {
        pageTitle: "Quản lý tour",
        tourList: tourList,
        accountAdminList: accountAdmin,
        categoryList: categoryTree, pagination: pagination
    })
}


module.exports.create = async (req, res) => {
    const categoryList = await Category.find({
        deleted: false
    });
    const categoryTree = helper.buildCategoryTree(categoryList);
    const cityList = await City.find({});
    res.render('admin/pages/tour-create', {
        pageTitle: "Tạo mới tour",
        categoryList: categoryTree,
        cityList: cityList,
    })
}
module.exports.edit = async (req, res) => {
    try {

        const id = req.params.id;
        const tourDetail = await Tour.findOne({ _id: id, deleted: false })
        if (tourDetail) {
            console.log(tourDetail)
            const categoryList = await Category.find({
                deleted: false
            });
            tourDetail.departureDateFormat = moment(tourDetail.departureDate).format("YYYY-MM-DD")



            const categoryTree = helper.buildCategoryTree(categoryList);
            const cityList = await City.find({});
            res.render('admin/pages/tour-edit', {
                tourDetail: tourDetail,
                pageTitle: "Tạo mới tour",
                categoryList: categoryTree,
                cityList: cityList,
            })
        }
        else {
            res.redirect(`/${pathAdmin}/tour/list`)

        }
    }
    catch {
        res.redirect(`/${pathAdmin}/tour/list`)
    }
}
module.exports.createPost = async (req, res) => {
    if (req.body.position) {
        req.body.position = parseInt(req.body.position);
    } else {
        const total = await Tour.countDocuments({});
        req.body.position = total + 1;

    }
    req.body.priceAdult = req.body.priceAdult ? parseInt(req.body.priceAdult) : 0;
    req.body.priceChildren = req.body.priceChildren ? parseInt(req.body.priceChildren) : 0;
    req.body.priceBaby = req.body.priceBaby ? parseInt(req.body.priceBaby) : 0;
    req.body.priceNewAdult = req.body.priceNewAdult ? parseInt(req.body.priceNewAdult) : req.body.priceAdult;
    req.body.priceNewChildren = req.body.priceNewChildren ? parseInt(req.body.priceNewChildren) : req.body.priceChildren;
    req.body.priceNewBaby = req.body.priceNewBaby ? parseInt(req.body.priceNewBaby) : req.body.priceBaby;
    req.body.stockBaby = req.body.stockBaby ? parseInt(req.body.stockBaby) : 0;
    req.body.stockAdult = req.body.stockAdult ? parseInt(req.body.stockAdult) : 0;
    req.body.stockChildren = req.body.stockChildren ? parseInt(req.body.stockChildren) : 0;

    req.body.locations = req.body.locations ? JSON.parse(req.body.locations) : [];
    req.body.departureDate = req.body.departureDate ? new Date(req.body.departureDate) : null;
    req.body.schedules = req.body.schedules ? JSON.parse(req.body.schedules) : [];




    req.body.createdBy = req.account.id;
    req.body.updatedBy = req.account.id;
    // Lấy ảnh đại diện
    if (req.files && req.files.avatar && req.files.avatar.length > 0) {
        req.body.avatar = req.files.avatar[0].path;
    } else {
        req.body.avatar = "";
    }

    // Lấy danh sách ảnh phụ
    if (req.files && req.files.images && req.files.images.length > 0) {
        req.body.images = req.files.images.map(file => file.path);
    } else {
        req.body.images = [];
    }
    const newrecord = new Tour(req.body);
    await newrecord.save();
    console.log(req.body);
    res.json({
        code: "success",
        message: "hi"
    })

}
module.exports.editPatch = async (req, res) => {
    try {
        const id = req.params.id;

        if (req.body.position) {
            req.body.position = parseInt(req.body.position);
        }

        req.body.priceAdult = req.body.priceAdult ? parseInt(req.body.priceAdult) : 0;
        req.body.priceChildren = req.body.priceChildren ? parseInt(req.body.priceChildren) : 0;
        req.body.priceBaby = req.body.priceBaby ? parseInt(req.body.priceBaby) : 0;
        req.body.priceNewAdult = req.body.priceNewAdult ? parseInt(req.body.priceNewAdult) : req.body.priceAdult;
        req.body.priceNewChildren = req.body.priceNewChildren ? parseInt(req.body.priceNewChildren) : req.body.priceChildren;
        req.body.priceNewBaby = req.body.priceNewBaby ? parseInt(req.body.priceNewBaby) : req.body.priceBaby;
        req.body.stockBaby = req.body.stockBaby ? parseInt(req.body.stockBaby) : 0;
        req.body.stockAdult = req.body.stockAdult ? parseInt(req.body.stockAdult) : 0;
        req.body.stockChildren = req.body.stockChildren ? parseInt(req.body.stockChildren) : 0;

        req.body.locations = req.body.locations ? JSON.parse(req.body.locations) : [];
        req.body.departureDate = req.body.departureDate ? new Date(req.body.departureDate) : null;
        req.body.schedules = req.body.schedules ? JSON.parse(req.body.schedules) : [];

        req.body.updatedBy = req.account.id;

        if (req.files && req.files.avatar && req.files.avatar.length > 0) {
            req.body.avatar = req.files.avatar[0].path;
        } else {
            delete req.body.avatar;
        }

        if (req.files && req.files.images && req.files.images.length > 0) {
            req.body.images = req.files.images.map(file => file.path);
        } else {
            delete req.body.images;
        }

        await Tour.updateOne({ _id: id, deleted: false }, req.body);

        res.json({
            code: "success",
            message: "Cập nhật tour thành công!"
        });
        req.flash("success", "Cập nhật tour thành công!");
    } catch (error) {
        res.json({
            code: "error",
            message: "Cập nhật tour thất bại!"
        });
    }
}
module.exports.deletePatch = async (req, res) => {
    try {
        const id = req.params.id;
        const deletedBy = req.account.id;
        const tourDetail = await Tour.findOne({
            _id: id,
            deleted: false
        })
        if (tourDetail) {
            await Tour.updateOne({ _id: id, deleted: false }, {
                deleted: true,

                deletedBy: deletedBy,
                deletedAt: Date.now()

            })
            req.flash("success", "Xoa thanh cong")

            res.json({
                code: "success",
                message: "Xoa thanh cong"
            })
        }
        else {
            res.json({
                code: "error",
                message: "Id khong hop le"
            })
        }


    }
    catch {
        res.json({
            code: "error",
            message: "Lỗi khi xoá"
        })
    }
}
module.exports.undoPatch = async (req, res) => {
    try {
        const id = req.params.id;
        const deletedBy = req.account.id;
        const tourDetail = await Tour.findOne({
            _id: id,
            deleted: true
        })
        if (tourDetail) {
            await Tour.updateOne({ _id: id, deleted: true }, {
                deleted: false,

                deletedBy: deletedBy,
                deletedAt: Date.now()

            })
            req.flash("success", "Khoi phuc thanh cong")

            res.json({
                code: "success",
                message: "Khoi phuc thanh cong"
            })
        }
        else {
            res.json({
                code: "error",
                message: "Id khong hop le"
            })
        }


    }
    catch {
        res.json({
            code: "error",
            message: "Lỗi khi khoi phuc"
        })
    }
}
module.exports.deleteDestroyPatch = async (req, res) => {
    try {
        const id = req.params.id;
        const deletedBy = req.account.id;
        const tourDetail = await Tour.findOne({
            _id: id,
            deleted: true
        })
        if (tourDetail) {
            await Tour.deleteOne({ _id: id, deleted: true })
            req.flash("success", "Xoa vinh vien thanh cong")

            res.json({
                code: "success",
                message: "Xoa thanh cong"
            })
        }
        else {
            res.json({
                code: "error",
                message: "Id khong hop le"
            })
        }


    }
    catch {
        res.json({
            code: "error",
            message: "Lỗi khi xoá"
        })
    }
}
module.exports.trash = async (req, res) => {


    const find = {
        deleted: true,

    }


    const tourList = await Tour.find(find

    )
        .sort({ deletedAt: "desc" });

    for (const item of tourList) {
        if (item.createdBy) {
            const createdByFullName = await AccountAdmin.findOne({ _id: item.createdBy })
            item.createdByFullName = createdByFullName.fullname;


        }
        if (item.deletedBy) {
            const deletedByFullName = await AccountAdmin.findOne({ _id: item.deletedBy })
            item.deletedByFullName = deletedByFullName.fullname;
        }


        item.createdAtFormat = moment(item.createdAt).format("HH:mm - DD/MM/YYYY")
        item.deletedAtFormat = moment(item.deletedAt).format("HH:mm - DD/MM/YYYY")

    }

    res.render('admin/pages/tour-trash', {
        pageTitle: "Quản lý tour",
        tourList: tourList,
    })
}

module.exports.changeTrashMultiPatch = async (req, res) => {
    try {
        const option = req.body.option;
        const ids = req.body.ids;

        switch (option) {
            case "undo":
                await Tour.updateMany(
                    { _id: { $in: ids } },
                    {
                        deleted: false,
                        updatedBy: req.account.id
                    }
                );
                req.flash("success", "Khôi phục các tour thành công!");
                break;

            case "delete-destroy":
                await Tour.deleteMany({
                    _id: { $in: ids }
                });
                req.flash("success", "Xóa vĩnh viễn các tour thành công!");
                break;

            default:
                return res.json({
                    code: "error",
                    message: "Hành động không hợp lệ!"
                });
        }

        res.json({
            code: "success",
            message: "Thực hiện thành công!"
        });
    } catch (err) {
        res.json({
            code: "error",
            message: "Đã có lỗi xảy ra!"
        });
    }
};
module.exports.changeMultiPatch = async (req, res) => {
    const { option, ids } = req.body;
    const updatedBy = req.account.id;
    switch (option) {
        case "active":
        case "inactive":
            await Tour.updateMany({ _id: { $in: ids } }, {
                status: option,
                updatedBy: updatedBy
            })
            return res.json({
                code: "success",
                message: "Thay doi trang thai thanh cong"
            });

        case "delete":
            await Tour.updateMany({ _id: { $in: ids } }, {
                deleted: true,
                deletedBy: updatedBy,
                deletedAt: Date.now()

            })
            return res.json({
                code: "success",
                message: "Thay doi trang thai thanh cong"
            });
        default:
            return res.json({
                code: "error",
                message: "Hành động không hợp lệ!"
            });
    }


}