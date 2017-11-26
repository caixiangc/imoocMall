
//model 是定义数据库各个字段类型的
var mongoose = require('mongoose');
var userSchema = new mongoose.Schema({ 
	"userId": String, //mongoose.Schema({object,object,cartList:[{object,object}])
	"userName": String,
	"userPwd": String,
	"orderList": Array,
	"cartList": [{                 
		"productId":String,
		"productName":String,
		"salePrice":String,
		"productImage":String,
		"checked":String,
		"productNum":String
	}],
	"addressList" : [
    {
        "addressId" : String,
        "userName" : String,
        "streetName" : String,
        "postCode" : Number,
        "tel" : Number,
        "isDefault" : Boolean
    }]
});

module.exports = mongoose.model("User",userSchema) //这里第三个参数千万不能加 users 集合名字 这个默认是用 第一个参数+s  去匹配数据库集合的
//模型定义好以后就要在router 里面实现功能了