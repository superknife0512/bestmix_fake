
const Product = require('../models/Product');
const fs = require('fs');
const path = require('path');

exports.getProductsPage = async (req,res,next)=>{
    const productType = req.params.productType;
    const products =await Product.find({productType: productType})
                            .select('_id name shortDes imgUrl');
    const typeArr = ['concrete', 'shield', 'floor', 'bond', 'other', 'progress'];
    let resultArr = [];

    for(let i=0; i<=5; i++){
        let productName = await Product.find({productType: typeArr[i]}).select('name');
        resultArr.push(productName);
    }   

    console.log(resultArr);
    let conProd, shieldProd, floorProd, bondProd, otherProd, progProd;

    [conProd, shieldProd, floorProd, bondProd, otherProd, progProd] = resultArr;
    
    const routerInner = [
        {
            title: 'Phụ gia bê tông-xi măng',
            link: '/product/concrete',
            id: "concrete",
            moreProd: conProd
        },
        {
            title: 'Chống thấm và trám bít',
            link: '/product/shield',
            id: "shield",
            moreProd: shieldProd
        },
        {
            title: 'Nền sàn và chất phủ bề mặt',
            link: '/product/floor',
            id: "floor",
            moreProd: floorProd
        },
        {
            title: 'Vữa rót - kết nối - sửa chữa - hoàn thiện',
            link: '/product/bond',
            id: "bond",
            moreProd: bondProd
        },
        {
            title: 'Sản phẩm cho các ngành sản xuất khác',
            link: '/product/other',
            id: "other",
            moreProd: otherProd
        },
        {
            title: 'Quy trình thi công',
            link: '/product/progress',
            id: "progress",
            moreProd: progProd
        },
    ]
    
    let typeTitle; 

    switch (productType) {
        case 'concrete':
            typeTitle = 'Phụ gia bê tông-xi măng';
            break;
        case 'shield':
            typeTitle = 'Chống thấm và trám bít';
            break;
        case 'floor':
            typeTitle = 'Nền sàn và chất phủ bề mặt';
            break;
        case 'bond':
            typeTitle = 'Vữa rót - kết nối - sửa chữa - hoàn thiện';
            break;
        case 'other':
            typeTitle = 'Sản phẩm cho các ngành sản xuất khác';
            break;
        case 'progress':
            typeTitle = 'Quy trình thi công';
            break;
    
        default:
            break;
    }
    res.render('products', {
        title: 'Product',
        path: '/product',
        routerInner,
        products,
        typeTitle,
        productType,
    })
}

exports.getProductDetail =async (req,res,next)=>{
    const typeArr = ['concrete', 'shield', 'floor', 'bond', 'other', 'progress'];
    let resultArr = [];

    for(let i=0; i<=5; i++){
        let productName = await Product.find({productType: typeArr[i]}).select('name');
        resultArr.push(productName);
    }   

    console.log(resultArr);
    let conProd, shieldProd, floorProd, bondProd, otherProd, progProd;

    [conProd, shieldProd, floorProd, bondProd, otherProd, progProd] = resultArr;

    let typeTitle;

    const productType = req.query.type;
    const productId = req.params.productId;

    switch (productType) {
        case 'concrete':
            typeTitle = 'Phụ gia bê tông-xi măng';
            break;
        case 'shield':
            typeTitle = 'Chống thấm và trám bít';
            break;
        case 'floor':
            typeTitle = 'Nền sàn và chất phủ bề mặt';
            break;
        case 'bond':
            typeTitle = 'Vữa rót - kết nối - sửa chữa - hoàn thiện';
            break;
        case 'other':
            typeTitle = 'Sản phẩm cho các ngành sản xuất khác';
            break;
        case 'progress':
            typeTitle = 'Quy trình thi công';
            break;
    
        default:
            break;
    }

    const product = await Product.findOne({_id: productId});

    const switches = ['mô tả', 'ưu điểm', 'thông số kĩ thuật', 'quy trình thi công'];
    const id = ['des', 'pros', 'specities', 'progressz'];

    const specitiesTable = product.specities.map(each=>{
        return each.split(':');
    })
    
    const routerInner = [
        {
            title: 'Phụ gia bê tông-xi măng',
            link: '/product/concrete',
            id: "concrete",
            moreProd: conProd
        },
        {
            title: 'Chống thấm và trám bít',
            link: '/product/shield',
            id: "shield",
            moreProd: shieldProd
        },
        {
            title: 'Nền sàn và chất phủ bề mặt',
            link: '/product/floor',
            id: "floor",
            moreProd: floorProd
        },
        {
            title: 'Vữa rót - kết nối - sửa chữa - hoàn thiện',
            link: '/product/bond',
            id: "bond",
            moreProd: bondProd
        },
        {
            title: 'Sản phẩm cho các ngành sản xuất khác',
            link: '/product/other',
            id: "other",
            moreProd: otherProd
        },
        {
            title: 'Quy trình thi công',
            link: '/product/progress',
            id: "progress",
            moreProd: progProd
        },
    ]
    res.render('productDetail', {
        title: product.name,
        path:'/product',
        routerInner,
        typeTitle,
        product,
        id,
        switches,
        productType,
        specitiesTable,        
    })
}

exports.downloadManual =async (req, res, next)=>{
    try{
        const prodId = req.params.prodId;
        const product = await Product.findOne({_id: prodId}).select('manualUrl');
        console.log(product);
        const fileStream = fs.createReadStream( product.manualUrl);
        fileStream.pipe(res);
    } catch (err){
        next(err);
    }

}