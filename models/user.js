const mongoose = require('mongoose');
const { Schema } = mongoose;
const passportLocalMongoose = require(`passport-local-mongoose`);

const userSchema = new Schema({
    email:{
        type: String,
        required: true,
        unique: true
    }
});

userSchema.plugin(passportLocalMongoose, {
    errorMessages: {
        MissingPasswordError: 'パスワードが指定されていません',
        AttemptTooSoonError: 'アカウントは現在ロックされています。後でもう一度試してください',
        TooManyAttemptsError: 'ログイン試行が多すぎてアカウントがロックされました',
        NoSaltValueStoredError: '認証が不可能です。ソルトの値が保存されていません',
        IncorrectPasswordError: 'パスワードまたはユーザー名が正しくありません',
        IncorrectUsernameError: 'パスワードまたはユーザー名が正しくありません',
        MissingUsernameError: 'ユーザー名が指定されていません',
        UserExistsError: '指定されたユーザー名のユーザーは既に登録されています'
    }
});

module.exports = mongoose.model('User', userSchema);