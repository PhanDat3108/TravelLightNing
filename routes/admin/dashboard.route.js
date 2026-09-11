const router= require('express').Router();
const dashboardController= require('../../controllers/admin/dashboard.controllers')
router.get('/',dashboardController.dashboard
)


module.exports= router;