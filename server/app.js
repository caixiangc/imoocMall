// 这些都是通过 express-generator 生成的
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');  // morgan这个插件是对日志进行输出的
var cookieParser = require('cookie-parser'); //cookie-parser 这个模块是获取cookie信息并进行转换的
var bodyParser = require('body-parser');
var ejs = require('ejs')
var index = require('./routes/index');
var users = require('./routes/users');
var goods = require('./routes/goods')

var app = express(); //这里定义了一个app的express那么相当于起了一个服务

// view engine setup
app.set('views', path.join(__dirname, 'views')); //这里是设置views（视图），设置视图访问目录是__dirname下的views，__dirname指的是当前目录（app在server目录，views是在server目录下）

app.engine('.html',ejs.__express); //把.html 编译成jade
app.set('view engine', 'html');  //这里设置模板引擎为html
//app.set('view engine', 'jade'); 本来默认引擎是jade

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json()); //bodyParser 主要是对我们发过来的pose请求做一个监听转换
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public'))); //express.static是设置我们的静态目录，这里的join是用path模块里面的方法
                                    //这里设置目录是以public为根目录
//app.use(express.static(path.join(__dirname, 'views'))); //加了views 就是指定views为静态目录
app.use(function (req,res,next) { //这个是在没有登入情况下，对操作页面的一个拦截
  if(req.cookies.userId){  //***(重要)这个全局的拦截器是可以拦截所有 router 下的js，只要cookie 不存在都能把下面res.json()报头给返回给请求
    next();
  }else{
      console.log("url:"+req.originalUrl); //originalUrl指的是当前接口地址
      if(req.originalUrl=='/users/login' || req.originalUrl=='/users/logout' || req.originalUrl.indexOf('/goods/list')>-1){ //因为我们要匹配所有/goods后面的子集，所以要用indexOf只要看到/goods就给显示
          next();  //这是一个白名单匹配 ，只有匹配到上面的router地址了以后才能 执行next()
      }else{
          res.json({
            status:'10001',
            msg:'当前未登录', //如果没有匹配到上面的白名单路由就 显示 当前为登入
            result:''   //这三个信息是格式要填完
          });
      }
  }
});


app.use('/', index); //当我们访问‘/’目录的时候，没我们旧区加载 router 下的index.js
app.use('/users', users);//当我们访问‘/users’目录的时候，没我们旧区加载 router 下的users.js
app.use('/goods', goods);

// catch 404 and forward to error handler
app.use(function(req, res, next) {   //这个app.use是全局的对404一个拦截
  var err = new Error('Not Found');
  err.status = 404;  //这里定义了一个err状态为404；
  next(err); //把err传给next()这个函数，当next()下一步找不到了，就回去获取err ，如果err()拿到了参数就不会用err，如果拿不到就不用err
});

// error handler
app.use(function(err, req, res, next) { //下面这个use 就是对err的一个处理
  // set locals, only providing error in development
  res.locals.message = err.message;  //定义全局的message
  res.locals.error = req.app.get('env') === 'development' ? err : {};//定义全局的error

  // render the error page
  res.status(err.status || 500);
  res.render('error');  //一旦报错了，就会渲染这个报错的页面
});

module.exports = app;

