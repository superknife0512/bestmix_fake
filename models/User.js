const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    email:{
        type:String,
        require: true,
        unique: true,
    },
    password:{
        type:String,
        require: true,
    },
    inviteCode:{
        type: String,
        require: true,
    },
    token: String,
    tokenExpire: Date,
},{timestamps: true})

module.exports = mongoose.model('User', userSchema);