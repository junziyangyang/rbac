const mongoose = require('mongoose');
const schema = mongoose.Schema;
const objectId = schema.Types.ObjectId;
const moment = require('moment');

const UserRoleSchema = ({
    user_id: {type: objectId, ref: "User"},     // 用户ID
    role_id: {type: objectId, ref: "Role"},      //角色ID
    created_time: {type: Date, default: '0000-00-00 00:00:00'}      //插入时间
});

UserRoleSchema.pre('save', function (next) {
    this.created_time = moment().format('YYYY-MM-DD HH:mm:ss');
    next();
});

const UserRole = mongoose.model('UserRole', UserRoleSchema);

module.exports = UserRole;