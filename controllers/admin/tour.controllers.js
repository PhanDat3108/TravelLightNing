module.exports.list = async (req, res) => {
    res.render('admin/pages/tour-list', {
        pageTitle: "Quản lý tour",
        tourList: [] // Cấp mảng rỗng để vòng lặp danh sách tour không bị lỗi undefined
    })
}
module.exports.create = async (req, res) => {
    res.render('admin/pages/tour-create', {
        pageTitle: "Tạo mới tour",
        cityList: [] // Cấp mảng rỗng để không bị lỗi undefined
    })
}
module.exports.trash = async (req, res) => {
    res.render('admin/pages/tour-trash', {
        pageTitle: "Thùng rác",
        tourList: [] // Cấp mảng rỗng để không bị lỗi undefined
    })
}
