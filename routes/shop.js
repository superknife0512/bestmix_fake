const express = require('express');
const router = express.Router();

const shopController = require('../controllers/shopCtrl')
/* GET home page. */
router.get('/', shopController.getHomePage);
router.post('/find', shopController.getFind);
router.post('/send', shopController.postSendMsg);
router.get('/about-bestmix', shopController.getAboutBestmix);
router.get('/news', shopController.getNews);

//get detailed id
router.get('/news/*.:newsId', shopController.getNewsDetail);

module.exports = router;
