const mongoose = require('mongoose');

const msgSchema = mongoose.Schema({
    name: String,
    email: {
        type: String,
        require: true,
    },
    phone: {
        type: Number,
        require: true,
    },
    msg:{
        type: String,
        require: true,
    }
})

module.exports = mongoose.model('Message', msgSchema);