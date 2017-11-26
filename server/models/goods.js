//module.exports是nodejs后台的规范
var mongoose = require('mongoose');
var Schema = mongoose.Schema;  //通过mongoose来获取Schema这个对象

var productSchema = new Schema({ //Schema里面定义数据库模式（各字段什么的）
	"productId":{type:String},
	"productName":String,
	"salePrice":Number,
	"productImage":String,
	"productUrl":String,
	"productNum":Number,  //这两个字段是给购物车用的
	"checked":Number		//这两个字段是给购物车用的
}) 
module.exports = mongoose.model('Good',productSchema)  //module.exports把模式输出module.exports.user是带名字的输出,把mongoose.module('goods',productSchema)输出
//注意model 和module  model：是模型；；module：是模块
//这里命名Good 会自动去匹配goods

