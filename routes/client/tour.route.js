const router= require('express').Router();
const tourController= require('../../controllers/client/tour.controllers')
router.get('/',tourController.list
)
module.exports= router;