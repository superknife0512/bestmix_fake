
const Product = require('../models/Product');
const fs = require('fs');
const path = require('path');

const createErr = (msg, sttCode)=>{
    const err = new Error(msg);
    err.statusCode = sttCode;
    throw err;
}

const clearFile = (pathLike)=>{
    fs.unlink(path.join(__dirname, '..', pathLike), (err)=>{
        if(err){
            throw err
        }
    });
    console.log('clear dump img');
}

exports.postProduct = async (req,res,next)=>{
    const name = req.body.name;
    const prodType = req.body.productType;
    const shortDes = req.body.shortDes;
    const application = req.body.application;
    const desc = req.body.desc;
    const pros = req.body.pros;
    const specities = req.body.specities;
    const progress = req.body.progress;
    console.log(req.files);
    try{
        if(!req.files){
            return createErr('loi cmnr', 422)
        }
        if(!name || !prodType || !shortDes || !application || !desc || !pros || !specities || !progress){
            return createErr('You must enter all field', 422)
        }
        const manualUrl = req.files['manual'][0].path.replace(/\\/g, '/');
        const prodImgUrl = req.files['imageProduct'][0].path.replace(/\\/g, '/');

        const descArr = desc.split('$$');
        const prosArr = pros.split('$$');
        const specitiesArr = specities.split('$$');
        const progressArr = progress.split('$$');

        const product = new Product({
            name,
            productType: prodType,
            shortDes,
            application,
            desc: descArr,
            pros: prosArr,
            specities: specitiesArr,
            progress: progressArr,
            manualUrl,
            imgUrl: prodImgUrl
        })
        const result = await product.save();
        res.redirect('/admin/pannel')
        // console.log(result);
    } catch (err) {
        next(err);
    }
}

exports.postDeleteProd =async (req,res,next)=>{
    const prodId = req.body.productId;
    try{
        const product = await Product.findById(prodId);
        console.log(product);
        clearFile(product.imgUrl);
        clearFile(product.manualUrl);

        await Product.deleteOne({_id: prodId});
        console.log('Delete product done'); 
        res.redirect('/admin/pannel')

    } catch (err) {
        next(err)
    }
}

exports.postEditProduct =async (req,res,next)=>{
    const name = req.body.name;
    const productType = req.body.productType;
    const shortDes = req.body.shortDes;
    const application = req.body.application;
    const desc = req.body.desc;
    const pros= req.body.pros;
    const specities = req.body.specities;
    const progress = req.body.progress;
    try{
        const prodId = req.body.productId
        const product = await Product.findById(prodId);
        let files = req.files;
        product.name = name;
        product.productType = productType;
        product.shortDes = shortDes;
        product.application = application;
        product.desc = desc.split('$$');
        product.pros = pros.split('$$');
        product.specities = specities.split('$$');
        product.progress = progress.split('$$');
        
        if(files['manual'] || files['imageProduct']){ 
            if(files['manual'] && files['imageProduct']){
                clearFile(product.imgUrl);
                clearFile(product.manualUrl)

                product.manualUrl = files['manual'][0].path.replace(/\\/g, '/');
                product.imgUrl = files['imageProduct'][0].path.replace(/\\/g, '/');
                await product.save();
                res.redirect('/admin/pannel');
                console.log('save with 2 img');
            } else if (files['manual'] && !files['imageProduct']){
                //only pdf manual
                clearFile(product.manualUrl);
                product.manualUrl = files['manual'][0].path.replace(/\\/g, '/');
                await product.save();
                console.log('save with 1.1 img');
                res.redirect('/admin/pannel');

            } else if (!files['manual'] && files['imageProduct']){
                //only img
                clearFile(product.imgUrl)
                product.imgUrl = files['imageProduct'][0].path.replace(/\\/g, '/');
                await product.save();
                res.redirect('/admin/pannel');

                console.log('save with 1.2 img');
            }
        } else {
            await product.save();
            res.redirect('/admin/pannel')
            console.log('save without img');
        }

    } catch (err) {
        next (err)
    }
}