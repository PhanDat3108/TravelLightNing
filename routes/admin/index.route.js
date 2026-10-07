const router = require('express').Router();
const accountRoutes = require('./account.route')
const dashboardRoutes = require('./dashboard.route')
const categoryRoutes = require('./category.route')
const tourRoutes = require('./tour.route')
const settingRoutes = require('./setting.route')

const authMiddleware = require('../../middlewares/admin/auth.middleware')
router.use((req, res, next) => {
    res.setHeader('Cache-control', 'no-store');
    next();
});
router.use('/setting', authMiddleware.verifyToken, settingRoutes)

router.use('/dashboard', authMiddleware.verifyToken, dashboardRoutes)
router.use('/account', accountRoutes)
router.use('/category', authMiddleware.verifyToken, categoryRoutes)
router.use('/tour', authMiddleware.verifyToken, tourRoutes)

module.exports = router;