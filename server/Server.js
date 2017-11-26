let http = require('http');
let url = require('url');
let util = require('util');
let fs = require('fs');
let server = http.createServer((req,res)=>{
	//res.statusCode = 200;
	//res.setHeader("Content-Type","text/plain;charset=utf-8");
	var pathname = url.parse(req.url).pathname; //两个pathname并不是同一个，一个自己定义，一个自带
	//console.log(`parse:${url.parse(req.url)}`);
	console.log("file:"+pathname.substring(1));
	fs.readFile(pathname.substring(1),(err,data)=>{  //fs.readFile()作用是在服务器上访问其他文件(加载静态资源)
		if(err){
			res.writeHead(404,{ //第二个参数设置他的内容类型和格式
				'Content-Type':'text/html'
			})
		}else{
			res.writeHead(200,{
				'Content-Type':'text/html'
			});
		res.write(data.toString());// 把data变成一个字符串写进去
		}
		res.end()
	});
//node 本身是为客户端提供接口的
})                                
server.listen(3000,'127.0.0.1',()=>{
	console.log("请打开127.0.0.1:3000")
})