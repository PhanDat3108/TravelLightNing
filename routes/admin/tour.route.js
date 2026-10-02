const router = require('express').Router();
const tourController = require('../../controllers/admin/tour.controllers')
const multer = require('multer');

const cloudinaryHelper = require("../../helpers/cloudinary.helper")
const upload = multer({ storage: cloudinaryHelper.storage });
router.get('/list', tourController.list
)
router.get('/create', tourController.create
)
router.get('/edit', (req, res) => {
    res.redirect(`/${global.pathAdmin || 'admin'}/tour/list`);
});
router.get('/edit/:id', tourController.edit
);
router.post('/create', upload.fields([
    { name: 'avatar', maxCount: 1 },
    { name: 'images', maxCount: 10 }
]), tourController.createPost
);
router.patch('/edit/:id', upload.fields([
    { name: 'avatar', maxCount: 1 },
    { name: 'images', maxCount: 10 }
]), tourController.editPatch
)
    ;
router.patch('/delete/:id', tourController.deletePatch
)
    ;
router.get('/trash', tourController.trash
)

module.exports = router;