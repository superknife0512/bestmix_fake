const News = require('../models/News');
const Product = require('../models/Product')
const Message = require('../models/clientMsg');
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth:{
        user: 'superknife0511@gmail.com',
        pass: 'Toan1234',
    }
})

const createErr = (errMsg, errCode)=>{
    const error = new Error(errMsg);
    error.statusCode = errCode;
    return error
}

const handleErr = (error, next)=>{
    if(!error.statusCode){
        error.statusCode = 500
    }
    next(error)
}

const clearImages = (arrayImagesPath)=>{
    arrayImagesPath.forEach(imagePath=>{
        const absPath = path.join(__dirname, '..', imagePath );
        fs.unlink(absPath, err=>{
            if(err){
                throw err;
            }
            console.log('Deletes dump files');
        })
    })
}

exports.getCreate =async (req,res,next)=>{
    const editMode = req.query.edit;
    const newsId = req.query.newsId;
    const editProdMode = req.query.editProd;
    const prodId = req.query.prodId;
    console.log(req.user);
    try{
        if(editMode && newsId){
            const newsEdit = await News.findById(newsId).select('title desc newsType _id');  
            return res.render('admin/createRes',{
                title: 'admin edit news',
                path: 'admin/create',
                editMode,
                newsEdit,
                editProdMode:false,
                prodEdit: {
                    productType: 'concrete'
                },
            })          
        }
        if(editProdMode && prodId){
            const prodEdit = await Product.findById(prodId);
            return res.render('admin/createRes',{
                title:'admin edit product',
                path: 'admin/create',
                editProdMode,
                prodEdit,
                editMode: false,
                newsId: null,
            })
        }   
        res.render('admin/createRes',{
            title: 'admin create',
            path: 'admin/create',
            //for news edit
            editMode: false,
            newsId: null,
            // for prod edit
            editProdMode:false,
            prodEdit: {
                productType: 'concrete'
            },
            
        })
    } catch (err){
        next(err)
    }
}

exports.getAdminPannel =async (req,res,next)=>{
    try{

        const news = await News.find();
        const products = await Product.find().select('_id name shortDes imgUrl');
        const messages = await Message.find();
        // console.log(news);
        const newsArr = news.map(eachNews=>{
            return{
                title: eachNews.title,
                imageUrls: eachNews.imageUrls,
                _id: eachNews._id,
                shortDes: eachNews.desc.split(' ').slice(0,10).join(' '),
            }
        })
    
        res.render('admin/adminPannel',{
            title: 'admin pannel',
            path: 'admin/pannel',
            news: newsArr,
            products,
            messages,
        })
    } catch (err){
        console.log(err);
        handleErr(err, next);
    }
}

exports.postCreate = async (req,res,next)=>{
    try{
        title = req.body.title;
        desc = req.body.desc;
        newsType = req.body.newsType
        files = req.files;
        console.log(title, desc, newsType, files);
        if(!title || !desc || !newsType){
            throw createErr('You must enter all fields',422)
        }
        if(!files){
            throw createErr('Something not right with your files', 422)
        }
        const filePaths = files.map( file=>{
            return file.path.replace(/\\/g, '/');
        })
        const news = new News({
            title: title,
            desc: desc,
            newsType: newsType,
            imageUrls: filePaths
        })
        const result = await news.save();
        console.log(result);
    } catch (err){
        next(err)
    }
    res.redirect('/admin/pannel')
}

exports.postDeleteNews = async (req,res,next)=>{
    const newsId = req.body.newsId;
    console.log(newsId);
    try{
        const news = await News.findById(newsId);
        clearImages(news.imageUrls);
       
        const result = await News.deleteOne({_id: newsId});        

        res.redirect('/admin/pannel');

    } catch (err){
        next(err)
        console.log(err);
    }
}

exports.postEditNews =async (req, res, next )=>{
    const newTitle = req.body.title;
    const newDesc = req.body.desc;
    const newType = req.body.newsType;
    const newsId = req.body.newsId
    let newImgUrls;
    try {
        const result = await News.findById(newsId);
        result.title = newTitle;
        result.desc = newDesc;
        result.newsType = newType;

        if(req.files.length < 1){
            //if we dont have any imgs
            await result.save();

        } else {
            newImgUrls = req.files.map(file=>{
                return file.path;
            }) 
            console.log(newImgUrls);
            clearImages(result.imageUrls);
            result.imageUrls = newImgUrls;
            await result.save();
        }
        res.redirect('/admin/pannel')
    } catch(err){
        next(err)
    }

}

exports.getReply = async (req,res,next)=>{
    const msgId = req.params.msgId;

    try{
        const message =await Message.findById(msgId);
        if(!message){
            return createErr('The message can nou found', 422);
        }

        res.render('admin/reply',{
            title: 'Reply',
            path: '/reply',
            message,
        })

    }catch(err){
        next(err);
    }
}

exports.postReply =async (req,res,next)=>{
    const msgId = req.body.msgId;
    const adminName = req.body.adminName;
    const adminMsg = req.body.message;

    try{
        const msg =await Message.findById(msgId);
        const mailOption = {
            from: adminName,
            to: msg.email,
            subject: `Bestmix reply Mr. ${msg.name}'s mail`,
            html:`<h4>Follow your message, here's what us reply:</h4>
                <p>${adminMsg}</p>
                <p>-----------------------------</p>
                <p>Our phone: 01282759831</p>
                <p>Our adress: 445 Hai phong street</p>
                <p style="color: orangered">Admin: ${adminName}</p>`
        }

        transporter.sendMail(mailOption, (err, info)=>{
            if(err){
                throw err
            } else {
                console.log(info.response);
                res.redirect('/admin/pannel')
            }
        })

    } catch (err) {
        next(err);
    }
}

exports.deleteMsg =async (req,res,next)=>{
    try{
        const msgId = req.params.msgId;
        await Message.findByIdAndRemove(msgId);
        
        res.status(200).json({
            "body":{
                "msg": "cax"
            }
        })
    } catch (err){
        res.status(500).json({
            "msg": "error",
            "data": err,
        })
    }
}