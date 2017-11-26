# imoocMall
imooc_node_mongodb   
1.安装依赖： npm install  
2.启动mongodb：1.mongod --dbpath="E:\MongoDataBase\data" --auth    
                cmd：mongo-》use admin --》 db.auth("admin","admin") --》use demo --》db.users.findOne()  
                mongod --dbpath=/root/workspace/mongoDB/data --  
                logpath=/root/workspace/mongoDB/logs/mongo.log --logappend --auth  //服务器上的  
3.开启后台服务：node bin/www （在server目录下）  
4.开启前端： npm run dev（在workspace目录下）  

 
