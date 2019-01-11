const News = require('../models/News');
const Message = require('../models/clientMsg');
const Product = require('../models/Product');
const url = require('url');

exports.getHomePage = async (req,res,next) => {
    data=[
        {
            icon: 'fas fa-microscope',
            title: 'Nghiên cứu và phát triển',
            detail: 'Các sản phẩm dùng để thay thế nguyên liệu, hóa chất ngoại nhập.'
        },
        {
            icon: 'fas fa-industry',
            title: 'Sản xuất',
            detail: 'Các sản phẩm phụ gia, chống thấm, sơn, kết nối, vữa rót, sữa chữa, xử lý bề mặt'
        },
        {
            icon: 'fas fa-map-marked-alt',
            title: 'Phân phối',
            detail: 'Hóa chất và nguyên liệu cho các nhà máy sản xuất của tất cả các ngành liên quan.'
        },
        {
            icon: 'fas fa-building',
            title: 'Thi công',
            detail: 'Hệ thống sơn và chống thấm'
        },
    ]
    
    dataConstruct = {
        doing:[
            {
                img:'images/construct/doing1.jpg',
                title: 'Dự án văn phòng công ty Axon'
            },
            {
                img:'images/construct/doing2.jpg',
                title: 'Dự án mở rộng khu liên hợp sản xuất, lắp ráp oto Thaco Mazada'
            },
            {
                img:'images/construct/doing3.jpg',
                title: 'Thi công sơn epoxy tự san phẳng cho nhà máy nhựa Rạng Đông'
            }
        ],

        outStanding:[
            {
                img:'images/construct/standing1.jpg',
                title: 'Dự án văn phòng công ty Axon'
            },
            {
                img:'images/construct/standing2.jpg',
                title: 'Dự án mở rộng khu liên hợp sản xuất, lắp ráp oto Thaco Mazada'
            },
            {
                img:'images/construct/standing3.jpg',
                title: 'Thi công sơn epoxy tự san phẳng cho nhà máy nhựa Rạng Đông'
            }
        ],

        chemistry:[
            {
                img: 'images/construct/chem1.jpg',
                title: 'Cung cấp sản xuất keo dán gạch khu chung cư Azura towel'
            },
            {
                img: 'images/construct/chem2.jpg',
                title: 'TT hành chính tp. Đà Nẵng '
            },
            {
                img: 'images/construct/chem3.jpg',
                title: 'Nhà máy xi măng văn hóa'
            },
        ]
    }

    const featureNews = await News.find().limit(3);
    const shortDesArr = featureNews.map(each=>{
        return each.desc.split(' ').slice(0,11).join(' ')
    })    

    res.render('index',{
        title: 'Home',
        data,
        path: '/',
        featureNews,
        shortDesArr
    })
}

exports.getAboutBestmix = (req, res, next)=>{
    res.render('aboutBestmix',{
        title: 'About us',
        path:'/about-bestmix',
    })
}

exports.getNews =async (req,res,next)=>{
    try{
        let type = req.query.type;
        let news =await News.find({newsType: type}).sort('-time');
        if(!req.query.type){
            news = await News.find().sort('-time');
        }    
        //return date string
        const newsArr = news.map(each => {
            const dateString = new Date(each.time);
            const shortDes = each.desc.split(' ').slice(0,11).join(' ');
            const SEO = each.title.split(' ').join('-');
            return {
                _id: each._id,
                title: each.title,
                imageUrls: each.imageUrls,
                newsType: each.newsType,
                dateString: dateString.toISOString().split('T')[0],
                shortDes,
                SEO: SEO,
            }
        })
        const firstNews = newsArr[0];
        const hotImage =  firstNews.imageUrls
        console.log(newsArr);
        res.render('news', {
            title: 'News',
            path: '/news',
            firstNews,
            news: newsArr,
            type,
            hotImage: hotImage[1]
        })
    } catch (err){
        console.log(err);
    }
}

exports.getNewsDetail =async (req,res,next)=>{
    const newsId = req.params.newsId;
    try{
        const newsDoc =await News.findById(newsId);
        const allNews = await News.find().limit(4);

        if(!newsDoc){
            const err = new Error('Some thing went wrong');
            err.statusCode = 500;
            throw err
        }
        const contentArr = newsDoc.desc.split(' - ')
        const news = {
            _id: newsDoc._id,
            title: newsDoc.title,
            dateString: newsDoc.time.toISOString().split('T')[0],
            imageUrls: newsDoc.imageUrls,
            contentArr
        }

        res.render('newsDetail',{
            title: news.title,
            path: '/title',
            news,
            allNews,
        })
    }
     catch(err){
         next (err);
     }
}

exports.postSendMsg =async (req, res, next)=>{
    const name = req.body.name;
    const email = req.body.email;
    const phone = req.body.phone;
    const msg = req.body.msg;
    try{
        const message = new Message({
            name: name,
            email: email,
            phone,
            msg,
        })
        const result = await message.save();      
        console.log(result);  
        res.redirect('/');
    } catch (err){
        next(err);
    }
}

exports.getFind =async (req,res,next)=>{
    try{
        const search = req.body.find;
        const productsArr = await Product.find().select('name shortDes productType imgUrl'); // return an array
        console.log(productsArr);
        let searchResults = [];
        for( prod of productsArr ){
            if(prod.name.toLowerCase().match(search.toLowerCase())){
                searchResults.push(prod);
            }
        }
        console.log(searchResults);
        res.render('find',{
            title:'Search',
            path: '/find',
            searchResults,
            search
        })

    } catch (err) {
        next(err)
    }

}