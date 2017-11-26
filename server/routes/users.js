var express = require('express');
var router = express.Router();
require('./../util/util.js');
var User = require('./../models/users.js') // ./ 当前文件夹下，../上个文件夹下，./../models上个目录下的models文件夹
	//这里是二级路由，app.js李main是一级路由
router.get('/', function(req, res, next) {
	res.send('response with a resource')
})

/*router.get('/user',function(req,res,next){
	res.send('test')
})*/
router.post('/login', function(req, res, next) { //next 是接着往后走 
	//拿从前端拿过来的数据
	var params = { //node 全都是 对象（名：值） 所以很多都是冒号
			userName: req.body.userName,
			userPwd: req.body.userPwd
		}
		//要通过mongoose 操作user表，所以要引用 mongodb 模型
	User.findOne(params, function(err, doc) {
		if (err) {
			res.json({
				status: '1',
				msg: err.message
			})
		} else {
			if (doc) {
				//cookie 的存取 通过res.cookie 来往response 响应里面写，这样前端才能拿到
				res.cookie("userId", doc.userId, { //cookie（cok名字，cok值，｛参数｝）
					path: '/', //放到域名里面去
					maxAge: 1000 * 60 * 60 //cookie周期（这里一个小时）

				})
				res.cookie("userName", doc.userName, { //cookie（cok名字，cok值，｛参数｝）
						path: '/', //放到域名里面去
						maxAge: 1000 * 60 * 60 //cookie周期（这里一个小时）

					})
					//也可以存入session，session是客户端发过来的，所以要用req来获取
					//req.session.user = doc;
				res.json({
					status: '0',
					msg: '',
					result: {
						userName: doc.userName
					}
				})
			}
		}
	})
})
router.post("/logout", function(req, res, next) {
	res.cookie("userId", '', {
		path: '/',
		maxAge: -1 //cookie的生命周期设置为-1表示失效
	})
	res.cookie("userName", '', {
		path: '/', //把名称为userName的cookie给删除
		maxAge: -1 //cookie的生命周期设置为-1表示失效
	})
	res.json({
		status: '0',
		msg: '',
		result: '已经成功清除缓存'
	})
})
router.get("/checkLogin", function(req, res, next) {
		if (req.cookies.userId) {  //获取cookie的时候 ，是cookies后面有s 害得我好惨
			res.json({
				status: "0",
				msg: "",
				result: req.cookies.userName
			})
		} else {
			res.json({
				status: "1",
				msg: "未登入",
				result: ''
			})
		}
})
	//查询当前用户购物车数据
router.get("/cartList", function(req, res, next) {
	var userId = req.cookies.userId;
	User.findOne({
		userId: userId
	}, function(err, doc) {
		if (err) {
			res.json({
				status: '1',
				msg: err.message,
				result: ''
			});
		} else {
			if (doc) {
				res.json({
					status: '0',
					msg: '查询成功',
					result: doc.cartList
				});
			}
		}
	})
})
router.post("/cartDel", function(req, res, next) {
		let userId = req.cookies.userId; //在router.post（get）请求里面 一段结束要用分号不能逗号
		let productId = req.body.productId;
		User.update({
			userId: userId
		}, {
			$pull: { //$pull 推到 也就是删除
				'cartList': {
					'productId': productId
				}
			}
		}, function(err, doc) { //千万小心是update 不是updata
			if (err) {
				res.json({
					status: '1',
					msg: err.message,
					result: ''
				})
			} else {
				res.json({
					status: '0',
					msg: '',
					result: 'success'
				})
			}
		})
	})
	//修改商品数量
router.post("/cartEdit", function(req, res, next) { //他这个post地址,并不是它请求，而是一个记号，给视图的vue文件定位用的
	var userId = req.cookies.userId,
		productId = req.body.productId,
		productNum = req.body.productNum,
		checked = req.body.checked; //****当后面是数据库操作要;
	User.update({
		"userId": userId,
		"cartList.productId": productId
	}, {
		"cartList.$.productNum": productNum, //更新子文档 就是要用 占位符$的
		"cartList.$.checked": checked, //**在mongoose操作数据库的时候。写完一条参数一定要加逗号
	}, function(err, doc) {
		if (err) {
			res.json({
				status: '1',
				msg: err.message,
				result: 1
			})
		} else {
			res.json({
				status: '0',
				msg: '',
				result: -1
			})
		}
	})
})
router.post("/editCheckAll", function(req, res, next) {
		var userId = req.cookies.userId,
			checkAll = req.body.checkAll ? '1' : '0';
		User.findOne({
			userId: userId
		}, function(err, user) { //user.findOne({params})里面参数是不能用引号引的
			if (err) {
				res.json({
					status: '1',
					msg: err.message,
					result: ''
				})
			} else {
				if (user) {
					user.cartList.forEach((item) => {
						item.checked = checkAll;
					})
					user.save(function(err1, doc) {
						if (err1) {
							res.json({
								status: '1',
								msg: err1.message,
								result: ''
							})
						} else {
							res.json({
								status: '0',
								msg: '',
								result: {
									list: user
								}
							})
						}
					})
				}
				/*  后台文件一定要按照格式来否者 会报错 ，如 if(){}外面不能写 res.json()
							res.json({
								status:'0',
								msg:'',
								result:'success'
							})*/
			}
		})
	})
	//查询用户地址借口
router.get("/addressList", (req, res, next) => {
		var userId = req.cookies.userId;
		User.findOne({
			userId: userId
		}, function(err, doc) {
			if (err) {
				res.json({
					status: '1',
					msg: err.message,
					result: ''
				})
			} else {
				res.json({
					status: '1',
					msg: '',
					result: doc.addressList
				})
			}
		})
	})
	//设置默认地址接口
router.post("/setDefault", function(req, res, next) {
		var userId = req.cookies.userId,
			addressId = req.body.addressId;
		if (!addressId) {
			res.json({
				status: '1003',
				msg: 'address Is Null',
				result: ''
			})
		} else {
			User.findOne({
				userId: userId
			}, (err, doc) => {
				if (err) {
					res.json({
						status: '1',
						msg: err.message,
						result: ''
					})
				} else {
					var addressList = doc.addressList;
					addressList.forEach((item) => {
						if (item.addressId == addressId) {
							item.isDefault = true
						} else {
							item.isDefault = false
						}
					});
					doc.save(function(err1, doc1) {
						if (err1) {
							res.json({
								status: '1',
								msg: err.message,
								result: ''
							})
						} else {
							res.json({
								status: '0',
								msg: '',
								result: ''
							})
						}
					})
				}
			})
		}
	})
	//删除地址借口
router.post("/delAddress", function(req, res, next) {
	var userId = req.cookies.userId,
		addressId = req.body.addressId;
	if (!addressId) {
		res.json({
			status: '1003',
			msg: 'Address is null',
			result: ''
		})
	} else {
		User.update({
			userId: userId
		}, {
			$pull: {
				'addressList': {
					'addressId': addressId
				}
			}
		}, function(err, doc) { //千万小心是update 不是updata
			if (err) { //update({},{})第一个参数是调教，第二个是$pull是删除指令
				res.json({
					status: '1',
					msg: err.message,
					result: ''
				})
			} else {
				res.json({
					status: '0',
					msg: '',
					result: 'success'
				})
			}
		})
	}
})
router.post("/payMent", function(req, res, next) {
		var userId = req.cookies.userId,
			orderTotal = req.body.orderTotal, //这里的req.body 是获取url路由信息，如果是get 是req.param
			addressId = req.body.addressId;
		User.findOne({
			userId: userId
		}, (err, doc) => {
			if (err) {
				res.json({
					status: '1',
					msg: err.message,
					result: ''
				})
			} else {
				var address = '';
				var goodsList = [];
				//获取用户地址信息
				doc.addressList.forEach((item) => {
					if (addressId == item.addressId) {
						address = addressId
					}
				});
				//获取用户购物车商品
				doc.cartList.filter((item) => {
					if (item.checked == '1') {
						goodsList.push(item);
					}
				});
				var platform = '622';
				var r1 = Math.floor(Math.random() * 10); //Math.random() 是 0-1 之前随机 *10 就是0-10之间随机
				var r2 = Math.floor(Math.random() * 10); //这两个随机数 是为了防止订单重复设置的

				var sysDate = new Date().Format('yyyyMMddhhmmss'); //Format 格式（系统时间）
				var createDate = new Date().Format('yyyy-MM-dd hh:mm:ss'); // 创建订单的时间
				var orderId = platform + r1 + sysDate + r2
				var order = {
					orderId: orderId,
					orderTotal: orderTotal,
					addressInfor: address,
					goodsList: goodsList,
					orderStatue: '1',
					createDate: createDate
				}
				doc.orderList.push(order);
				doc.save(function(err1, doc1) {
					if (err1) {
						res.json({
							status: '0',
							msg: '',
							result: ''
						})
					} else {
						res.json({
							status: '0',
							msg: '',
							result: {
								orderId: order.orderId,
								orderTotal: order.orderTotal
							}
						})
					}
				})
			}
		})
	})
	//根据订单查询订单信息
router.get("/orderDetail", (req, res, next) => {
	var userId = req.cookies.userId,
		orderId = req.param("orderId");
	User.findOne({
		userId: userId
	}, (err, userInfo) => {
		if (err) {
			res.json({
				status: '1',
				msg: err.message,
				result: ''
			})
		} else {
			var orderList = userInfo.orderList;
			if (orderList.length > 0) {
				var orderTotal = 0;
				orderList.forEach((item) => {
					if (item.orderId == orderId) {
						orderTotal = item.orderTotal;
					}
				})
				if (orderTotal > 0) {
					res.json({
						status: '0',
						msg: '',
						result: {
							orderId: orderId,
							orderTotal: orderTotal
						}
					})
				} else {
					res.json({
						status: '120002',
						msg: '无此订单',
						result: ''
					})
				}
			} else {
				res.json({
					status: '120001',
					msg: '当前未创建订单',
					result: ''
				})
			}
		}
	})
})
//获取购物车数量Vuex
router.get("/getCartCount",(req,res,next)=>{
	var userId = req.cookies.userId,
		orderId = req.param("orderId");
	User.findOne({userId:userId},(err,doc)=>{
		if(err){
			res.json({
				status:'1',
				msg:err.message,
				result:''
			})
		}else{
			var cartList = doc.cartList;
			var cartCount = 0;
			cartList.map(function(item){ //不光是forEach()可以用来遍历，.map()也是可以用来遍历
				cartCount += parseInt(item.productNum)
			})
			res.json({
				status:'0',
				msg:'获取成功',
				result:cartCount
			})
		}
	})
})
module.exports = router;