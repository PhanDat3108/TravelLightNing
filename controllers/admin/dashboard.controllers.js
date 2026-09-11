
module.exports.dashboard = async (req, res) => {
    res.render('admin/pages/dashboard', { 
        pageTitle: "tong quan",
        permissions: ["dashboard-view"], // Chống lỗi permissions.includes
        overview: {
            totalAdmin: 5,
            totalUser: 120,
            totalOrder: 350,
            totalPrice: 15000000
        } // Chống lỗi overview.totalAdmin
    })
}
