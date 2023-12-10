const mongoose = require('mongoose');
const { Schema } = mongoose;
const passportLocalMongoose = require(`passport-local-mongoose`);

const userSchema = new Schema({
    email:{
        Type: String,
        required: ture,
        unique: true
    }
});

userSchema.plugin(passportLocalMongoose);

module.exports = model('User', userSchema);