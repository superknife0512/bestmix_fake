var express = require('express');
var router = express.Router();
const adminController = require('../controllers/adminCtrl');
const { protectAuth } = require('../middlewares/protectAuth');

const multer = require('multer');

const multerStorage = multer.diskStorage({
    destination: (req,file,cb)=>{
        cb( null, './public/uploadImg');
    },
    filename: (req,file,cb)=>{
        cb( null, Date.now().toString() + '-' + file.originalname);
    }
  })
  
  const imageFilter = (req, file, cb)=>{
    if(file.mimetype === 'image/jpg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpeg'){
      cb(null, true)
    } else {
      cb(null, false)
    }
  }
const uploadImg = multer({storage: multerStorage, fileFilter: imageFilter}).array('images', 6);

router.get('/create',protectAuth , adminController.getCreate );

router.post('/create',protectAuth , uploadImg, adminController.postCreate );
router.get('/pannel',protectAuth , adminController.getAdminPannel );
//delete
router.post('/delete',protectAuth , adminController.postDeleteNews);
router.post('/reply',protectAuth , adminController.postReply);
router.get('/reply/:msgId',protectAuth , adminController.getReply);
router.post('/edit',protectAuth , uploadImg, adminController.postEditNews);
router.delete('/reply/:msgId', protectAuth, adminController.deleteMsg);

module.exports = router;
