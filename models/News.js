const mongoose = require('mongoose');

const newsSchema = mongoose.Schema({
    title:{
        type: String,
        require: true,
    },
    desc:{
        type: String,
        require: true,
    },
    time:{
        type: Date,
        default: Date.now()
    },
    imageUrls:[
        {type: String}
    ],
    newsType: {
        type: String,
        require:true,
    },
})

module.exports = mongoose.model('News', newsSchema);