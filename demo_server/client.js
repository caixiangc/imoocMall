var http = require('http');
let util = require('util')

http.get('http://www.imooc.com/u/card',(res)=>{  //http://www.imooc.com/u/card这个只是单纯的接口模拟，这个就是服务端的借口模拟调用
	let data = '';
	res.on("data",(chunk)=>{  //res.on("data",function) res.on 去监听data这个数据
		data += chunk;
	});
	res.on("end",()=>{
		let result = JSON.parse(data);  //把data转化为object对象
		let str_debug = util.inspect(result)
		console.log(data)  //如果直接输出我们没法使用
		console.log(`result:${result.msg}`)
		console.log(`这个接口模拟的所有信息：${str_debug}`)
		//这个就是模拟客户端的js，去调用第三方服务得到的结果
	})
})

