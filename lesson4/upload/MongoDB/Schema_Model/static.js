
const mongoose = require('../connetDB'),
    Schema = mongoose.Schema;
//定义表结构
const StaticSchema = new Schema({
    filename:{type: String},
    createTime:{type: String,default: Date.parse(new Date())}
},{
    _id:true,
    autoIndex:true,
    connection: 'Static'
})
//model化并返回
module.exports = mongoose.model("Static",StaticSchema);