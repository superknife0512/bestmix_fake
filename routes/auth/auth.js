const express = require('express');
const authController = require('../../controllers/authCtrl');

const router = express.Router();

router.get('/admin/signup', authController.getSignup );
router.post('/admin/signup', authController.postSignup );
router.get('/admin/login', authController.getLogin);
router.post('/admin/login', authController.postLogin);
router.get('/admin/logout', authController.postLogout);
router.get('/admin/forgot', authController.getForgot);
router.post('/admin/forgot', authController.postForgot);
router.post('/admin/reset', authController.postResetPass);
router.get('/admin/reset/:token', authController.getResetPass);

module.exports = router;