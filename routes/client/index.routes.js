const router= require('express').Router();
const tourRoutes= require('./tour.routes')
router.use('/tours',tourRoutes)

module.exports = router;