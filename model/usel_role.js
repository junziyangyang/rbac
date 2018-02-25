const mongoose = require('mongoose');
const schema = mongoose.Schema;
const objectId = schema.Types.ObjectId;
const moment = require('moment');

const UserRoleSchema = new schema({
    // user_id: {type: objectId, ref: 'User'},     // 用户ID
    // role_id: {type: objectId, ref: 'Role'},      //角色ID
    user_id: String,     // 用户ID
    role_id: String,      //角色ID
    created_time: {type: String, default: '0000-00-00 00:00:00'}      //插入时间
},
    {collection: 'userrs'});

UserRoleSchema.pre('save', function (next) {
    this.created_time = moment().format('YYYY-MM-DD HH:mm:ss');
    next();
});

const UserRole = mongoose.model('Userr', UserRoleSchema);

module.exports = UserRole;