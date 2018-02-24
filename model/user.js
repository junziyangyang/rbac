const mongoose = require('mongoose');
const schema = mongoose.Schema;
const objectId = schema.Types.ObjectId;
const moment = require('moment');

const UserSchema = new schema({
    name: String,      //姓名
    email: String,     //邮箱
    is_admin: {type: Number, default: 0},    //是否是超级管理员 1表示是 0表示不是
    status: {type: Number, default: 1},      //状态 1：有效 0：无效
    updated_time: {type: Date, default: '0000-00-00 00:00:00'},  //最后一次更新时间
    created_time: {type: Date, default: '0000-00-00 00:00:00'}    //插入时间
});

UserSchema.pre('save', function(next){
    this.created_time = moment().format('YYYY-MM-DD HH:mm:ss');
    this.updated_time = moment().format('YYYY-MM-DD HH:mm:ss');
    next();
});

const User = mongoose.model('User', UserSchema);

module.exports = User;