const router= require('express').Router();
const categoryController= require('../../controllers/admin/category.controllers')
router.get('/list',categoryController.list
)
router.get('/create',categoryController.create
)


module.exports= router;