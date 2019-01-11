
const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    name:{
        type:String,
        require: true,
    },
    productType: {
        type: String,
        require: true
    },
    shortDes:{
        type: String,
        require: true,
    },
    application: {
        type: String,
        require: true
    },
    manualUrl: {
        type: String,
        require: true
    },
    imgUrl:{
        type: String,
        require: true,
    },
    desc: [{
        type: String,
        require: true,
    }],
    pros: [{
        type: String,
        require: true
    }],
    specities:[{
        type: String,
        require: true,
    }],
    progress:[{
        type: String,
        require: true,
    }]
})

module.exports = mongoose.model('Product', productSchema);