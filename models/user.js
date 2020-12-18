const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        minlength: 5,
        maxlength: 20,
    }, 
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 20,
    }, 
    description: {
        type: String,
        required: true,
        minlength: 10,
        maxlength: 255,
    },
    email: {
        type: String, 
        required: true,
        minlength: 10,
        maxlength: 100,
        unique: true
    }, 
    password: {
        type: String, 
        required: true,
        minlength: 6,
        maxlength: 1024
    },

    profilePicture: { 
        type: String,
        default: 'https://style.anu.edu.au/_anu/4/images/placeholders/person.png'
    }, 
    followers: [
        {type: ObjectId, ref: "User"}
    ], 
    following: [
        {type: ObjectId, ref: "User"}
    ], 
});

module.exports = mongoose.model("User", UserSchema)