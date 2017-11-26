var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Goods = require('../models/goods');
//*****（重要）（坑）如果 mongo 里用 db.createUser( { user: “root”, pwd: “adminpwd”, roles: [ “root” ] } )  创建用户的话moogoose 这样 connect 就可以了mongoose.connect('mongodb://root:adminpwd@127:0:0:1:27017/db?authSource=admin')
//*****（重要）（坑）如果数据库连接url后面不跟数据库名，那么它虽然都能显示连接成功但是不能找到数据，所以要指定数据库然后,然后后面跟上管理员标识?authSource=admin
mongoose.connect('mongodb://admin:admin@127.0.0.1:27017/imooc?authSource=admin', {
  useMongoClient: true
})
mongoose.connection.on("connected", function() {
  console.log("mongodb connected success")
});
mongoose.connection.on("error", function() {
  console.log("mongodb connected fail")
});
mongoose.connection.on("disconnected", function() {
  console.log("mongodb connected disconnected")
});

//查询商品列表数据
router.get("/list", function(req, res, next) { //如果这里不加 /list 那么在不登入的情况下 也能加入购物车 ，要区分 /list 和 /cart
    //拿分页的各个信息
    let page = parseInt(req.param("page"));
    let pageSize = parseInt(req.param("pageSize")); //通过req.param拿到的参数都是字符串，所以这里要转化为int
    let sort = req.param("sort"); //req.param()可以获取前端传过来的参数就叫sort，通过url参数来控制怎么排序
    let skip = (page - 1) * pageSize;
    let priceLevel = req.param("priceLevel");
    var priceGt=''; var priceLte='';
    let params = {};
    if(priceLevel != 'all'){
      switch(priceLevel){   //这里参数priceLevel 是选择 下面case的
        case '0' :priceGt = 0 ; priceLte = 500 ; break;
        case '1' :priceGt = 500 ; priceLte = 1000 ; break;
        case '2' :priceGt = 1000 ; priceLte = 1500 ; break;
        case '3' :priceGt = 1500 ; priceLte = 2000 ; break;
        case '4' :priceGt = 2500 ; priceLte = 3000 ; break;
        case '5' :priceGt = 3000 ; priceLte = 3500 ; break;
      }
      params = { //把switch带过来的值，赋给param ，然后给Goods.find(params)，做筛选条件
        salePrice:{ //salePrice是一个筛选， /$gt（大于） 和$lte（小于） 都是mongodb的筛选语句
          $gt:priceGt, 
          $lte:priceLte
        }
      }
    };
     //这个param是个object
    //是limit 打错成limited ，limit是显示每页个数
    let goodsModel = Goods.find(params).skip(skip).limit(pageSize); // skip()是显示跳过多少条(就是跳过每页显示条数)是索引值// 因为这个find是返回一个模型的，表示这个find(param)是有条件的，这里goodsModel是一个模型
    goodsModel.sort({
      'salePrice': sort
    }); //因为mongodb是nosql类型，里面每个查询字段语句都是一个对象
    //对数据库进行查找全部
    goodsModel.exec(function(err, doc) { //第一个是查找的条件{}，参数；；exec()是一个执行语句
      if (err) {
        res.json({
          status: '1',
          msg: err.message
        });
      } else {
        res.json({
          status: '0',
          msg: '',
          result: { //这里的结果是 从mongodb里面读取出来的
            count: doc.length,
            list: doc
          }
        });
      }
    })

  })

//加入到购物车 .get()一般是从服务器里面拿到资源，.post()一般是提交数据到服务器
router.post("/addCart",function(req,res,next){///addCart"=== "/goods/addCart" 这是个二级路由，每次加载二级路由的时候，都会去加载一级路由所以前面goods不要
  var userId = '100000077';
  var productId = req.body.productId;       //post 和get 取参数是不一样的，post 要body，get 要 param
  var User = require('../models/users');  //通过模型来执行它的api  //然后我们需要一个模型User ，然后可以把它定义到全局里面去
  User.findOne({userId:userId},function(err,userDoc){// User.findOne("条件"，接收回调function(err,userDoc)) 这里返回参数userDoc可以拿来用 
    if(err){
      res.json({
        status:'1',
        msg:err.message
      })
    }
    else{
       console.log("userDoc:"+userDoc);    
        ////遍历购物车，然后重复的商品+1
        if(userDoc){ 
          let goodsItem = '';
          userDoc.cartList.forEach(function(item){ //item来源于userDoc
            if(item.productId == productId){
              goodsItem = item;
              item.productNum ++; //如果mongo数据库 初始没有字段productNum  那么 productNum++为NaN
            }
          });
          if(goodsItem){  //如果goodsItem为true 那么就把他保存进去
            userDoc.save(function(err2,doc2){   //save()里面一个回调，通过save保存到数据库
                  if(err2){
                    res.json({
                      status:'1',
                      msg:err2.message
                    })
                  }else{
                    res.json({
                        status:'0',
                        msg:'success',
                        result:{list:userDoc}
                      })
                  }
                }) 
          }else{
            //加入购物车
          Goods.findOne({"productId":productId},function(err,doc){ //这里是Goods.find()所以是从goods那个表拿数据
            if(err){
              res.json({  //res.json(...object)
                status:'1',
                msg:err.message
              });
            }
            else{
              if(doc){ //这里取的doc模型是 模型goods.js里面的
                doc.productNum = 1; //如果model的goods.js， 中没有productNum和checked 那么这两个字段是不起效的
                doc.checked = 1;
                userDoc.cartList.push(doc);//可以直接通过  模型.字段.push(doc)，就能把改变过的数据放进去
                userDoc.save(function(err2,doc2){   //save()里面一个回调，通过save保存到数据库
                  if(err2){
                    res.json({
                      status:'1',
                      msg:err2.message
                    })
                  }else{
                    res.json({
                        status:'0',
                        msg:'success',
                        //result:{list:doc2}
                        result:{list:doc}
                      })
                  }
                }) 
              }
            }
          })
          }
          
        }
   
    }    
  })
})



  //输出都是exports
module.exports = router;
//如果不输出 那么 app.js 中app.use('/goods', goods); 访问到是空的