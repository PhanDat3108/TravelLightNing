const router = require('express').Router();
const settingController = require('../../controllers/admin/setting.controllers')
const multer = require('multer');
const Role = require("../../models/role.model");


const cloudinaryHelper = require("../../helpers/cloudinary.helper")
const upload = multer({ storage: cloudinaryHelper.storage });
router.get('/list', settingController.list
)


router.get('/role/create', settingController.roleCreate);
router.post('/role/create', settingController.roleCreatePost);

router.get('/website-info', settingController.websiteInfo
)
router.patch('/website-info', upload.fields([
    { name: 'logo', maxCount: 1 },
    { name: 'favicon', maxCount: 10 }
]), settingController.websiteInfoPatch
)


module.exports = router;