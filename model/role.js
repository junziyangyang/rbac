const mongoose = require('mongoose');
const schema = mongoose.Schema;
const objectId = schema.Types.ObjectId;
const moment = require('moment');

const RoleSchema = ({
    name: String,     // 角色名称
    status: {type: Number, default: 1},      //状态 1：有效 0：无效
    updated_time: {type: Date, default: '0000-00-00 00:00:00'},     //最后一次更新时间
    created_time: {type: Date, default: '0000-00-00 00:00:00'}      //插入时间
});

RoleSchema.pre('save', function (next) {
    this.created_time = moment().format('YYYY-MM-DD HH:mm:ss');
    this.updated_time = moment().format('YYYY-MM-DD HH:mm:ss');
    next();
});

const Role = mongoose.model('Role', RoleSchema);

module.exports = Role;