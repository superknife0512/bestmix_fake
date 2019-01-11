
const express = require('express');
const shopProController = require('../../controllers/shopProCtrl');

const router = express.Router();

router.get('/download/:prodId', shopProController.downloadManual);
router.get('/:productType', shopProController.getProductsPage);
router.get('/:productType/:productId', shopProController.getProductDetail);

module.exports = router;