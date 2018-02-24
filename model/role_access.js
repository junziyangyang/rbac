const mongoose = require('mongoose');
const schema = mongoose.Schema;
const objectId = schema.Types.ObjectId;
const moment = require('moment');

const RoleAccessSchema = ({
    access_id: {type: objectId, ref: "User"},     // 权限id
    role_id: {type: objectId, ref: "Role"},      //角色id
    created_time: {type: Date, default: '0000-00-00 00:00:00'}      //插入时间
});

RoleAccessSchema.pre('save', function (next) {
    this.created_time = moment().format('YYYY-MM-DD HH:mm:ss');
    next();
});

const RoleAccess = mongoose.model('RoleAccess', RoleAccessSchema);

module.exports = RoleAccess;
