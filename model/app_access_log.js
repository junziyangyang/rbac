const mongoose = require('mongoose');
const schema = mongoose.Schema;
const objectId = schema.Types.ObjectId;
const moment = require('moment');

const AppAccessLogSchema = new schema({
    uid: Number,     //品牌UID
    target_url: String,      //访问的url
    query_params: String,    //get和post参数
    ua: String,      //访问ua
    ip: String,      //访问ip
    note: String,    //json格式备注字段
    create_time: {type: Date, default: "0000-00-00 00:00:00"}   //插入时间
});

const AppAccessLog = mongoose.model('AppAccessLog', AppAccessLogSchema);

module.exports = AppAccessLog;
