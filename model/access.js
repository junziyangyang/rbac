const mongoose = require('mongoose');
const schema = mongoose.Schema;
const objectId = schema.Types.ObjectId;
const moment = require('moment');

const AccessSchema = ({
    title: String,     // 权限名称
    urls: {type: Number, default: 1},      //json 数组
    status: String,      //'状态 1：有效 0：无效'
    updated_time: {type: Date, default: '0000-00-00 00:00:00'},     //最后一次更新时间
    created_time: {type: Date, default: '0000-00-00 00:00:00'}      //插入时间
});

AccessSchema.pre('save', function (next) {
    this.created_time = moment().format('YYYY-MM-DD HH:mm:ss');
    this.updated_time = moment().format('YYYY-MM-DD HH:mm:ss');
    next();
});

const Access = mongoose.model('Access', AccessSchema);

module.exports = Access;
