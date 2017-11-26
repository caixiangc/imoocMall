module.exports={
userName:"CaiXiang",
sayHello:function(){
	return "hello";
}
}
//require 是node 本来就有的模块
//module.export={数组，数组，...} 如果一个js文件（export）默认返回，那它就返回modult.export
//在node里。只要export.username=‘’ 输出了，在另外地方只要import 一下就可以用了
//在node服务器端可以直接用ES6语法