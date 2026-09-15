const router = require('express').Router();
const accountController = require('../../controllers/admin/account.controllers')
const accountValidate = require('../../validates/admin/account.validate');
const authMiddleware = require('../../middlewares/admin/auth.middleware');

router.get('/login', accountController.login
)
router.get('/register', accountController.register

)
router.post('/login', accountValidate.loginPost, accountController.loginPost
)
router.get('/register-initial', accountController.registerInitial
)
router.post('/register', accountValidate.registerPost, accountController.registerPost
)
router.post('/forgot-password', accountController.forgotPasswordPost
)
router.get('/forgot-password', accountController.forgotPassword
)
router.post('/otp-password', accountController.otpPasswordPost
)
router.get('/otp-password', accountController.otpPassword
)
router.get('/reset-password', authMiddleware.verifyToken, accountController.resetPassword
)
router.post('/reset-password', authMiddleware.verifyToken, accountController.resetPasswordPost
)
router.post('/logout', accountController.logout)

module.exports = router;