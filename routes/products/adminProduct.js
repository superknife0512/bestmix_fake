const express = require('express');

const router = express.Router();
const adminProController = require('../../controllers/adminProCtrl.js');
const { uploadFiles } = require('../../middlewares/uploadFiles');

router.post('/create-product', uploadFiles,  adminProController.postProduct)
router.post('/delete-prod', adminProController.postDeleteProd);
router.post('/edit-product', uploadFiles, adminProController.postEditProduct);
module.exports = router;