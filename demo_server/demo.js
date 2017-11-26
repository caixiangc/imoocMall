let user = require('./user.js')   //在commentjs规范里面，一个js文件就代表一个模块
console.log(`name:${user.userName}`);

//下面这些模块都是常用的
let http = require('http');
let url = require('url');
let util = require('util');

let server = http.createServer((req,res)=>{
	res.statusCode = 200;
	res.setHeader("Content-Type","text/plain;charset=utf-8");
	console.log(`url:${req.url}`)  //这里req.url并没有获取获取主机信息，只有  url:/index.html?a=123,但是正常情况下可以获取到主机信息
	res.end(util.inspect(url.parse(req.url)));//util.inspect()它主要的功能是把一个对象转化成字符串然后输出
									//parse里面必须是请求的地址，req
	//console.log(`url:${req.url}`)               // 这是个字符串 /demo.html?a=123
	//console.log(`parse:${url.parse(req.url)}`)  // 这是个[object]
	//console.log(`inspect:${req.url}`)           //inspect主要是用来调试用的，我们需要把object展开看具体的值

})                                
server.listen(3001,'127.0.0.1',()=>{
	console.log("请打开127.0.0.1:3001")
})