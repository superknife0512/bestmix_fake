const multer = require('multer');
  
const fileStorage = multer.diskStorage({
    destination: (req,file,cb)=>{
      cb(null, './public/productData');
    },
    filename: (req,file,cb)=>{
      cb(null, Date.now().toString()+ '-' + file.originalname);
    }
  })


const uploadFilter = (req,file,cb)=>{
    if(file.mimetype === 'image/jpg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpeg' || file.mimetype === 'application/pdf' ){
        cb(null, true)
    } else {
        cb(null, false)
        const err = new Error('not right file type');
        throw err
    }
}

exports.uploadFiles = multer({storage: fileStorage, fileFilter: uploadFilter})
    .fields([{name: 'manual', maxCount: 1}, {name: 'imageProduct', maxCount: 1}]);
