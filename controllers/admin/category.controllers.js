module.exports.list= async (req, res) => {
    res.render('admin/pages/category-list', { 
        pageTitle: "Danh muc",
        accountAdminList: [], // Chống lỗi vòng lặp bộ lọc người tạo
        categoryList: [],     // Chống lỗi vòng lặp danh sách và categoryList.length
        pagination: {         // Chống lỗi undefined khi hiển thị phân trang
            skip: 0,
            totalRecord: 0,
            totalPage: 1
        }
    })
}
module.exports.create= async (req, res) => {
    res.render('admin/pages/category-create')
}