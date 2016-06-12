# 使用express ＋ mogodb 搭建多人博客

###1. 初始化express

####1.1. 新建Express工程
```
npm install -g express-generator
express -e create-blog-with-express-and-mongodb
cd create-blog-with-express-and-mongodb
npm install
```

###2. 实现路由控制

index.js内实现路由控制，并在app.js内调用。

###3. 使用mogodb

启动mongodb数据库
```
mongod --dbpath ./blog
```
安装mongodb模块
```
npm install mongodb --save
```
新建setting.js存储mongodb配置信息,新建models/db.js创建数据库连接实例

###4. 支持Session
安装express-session和connect-mongo中间件
```
npm install express-session --save
npm install connect-mongo --save
```