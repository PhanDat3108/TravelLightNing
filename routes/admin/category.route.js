const router = require('express').Router();
const categoryController = require('../../controllers/admin/category.controllers')
const multer = require('multer');

const cloudinaryHelper = require("../../helpers/cloudinary.helper")
const categoryValidate = require("../../validates/admin/category.validate")
const upload = multer({ storage: cloudinaryHelper.storage });
router.get('/list', categoryController.list
)
router.post('/create', upload.single("avatar"), categoryValidate.createPost, categoryController.createPost
)

router.get('/create', categoryController.create
)

router.patch('/edit/:id', upload.single("avatar"), categoryValidate.createPost, categoryController.editPatch
)

router.get('/edit/:id', categoryController.edit
)
module.exports = router;