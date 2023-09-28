// const { default: mongoose } = require('mongoose');
const mongoose = require('mongoose');
const{Schema} = mongoose;
const UserSchema = new mongoose.Schema({
    name: String,
    email:{type:String,unique:true},
    Password:String,
});

const UserModel = mongoose.model('User',UserSchema);

module.exports= UserModel;