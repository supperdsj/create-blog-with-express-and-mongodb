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

###5. 添加ejs模板页
添加index.ejs、login.ejs、reg.ejs并提取footer.ejs、header.ejs

###6. 引入connect-flash模块
```
npm install connect-flash --save
```
并在app.js内添加引用

###7. 实现注册逻辑
添加user.js实现注册和查找用户,并在index.js内的/reg.post内实现注册。
在/.get和/reg.get内发送用户信息、成功/失败信息,并修改header.ejs显示上述信息。

###8. 实现登录登出逻辑
在/login.post内实现登录,在/logout.get内实现登出。

###9. 添加页面权限控制
在index.js内添加checkLogin和checkNotLogin中间件。

###10. 实现文章发表和文章查看
添加post.ejs模板,添加post.js实现发布文章和查找文章,并在index.js内进行相应调用

###11. 使文章支持markdown
'''
npm install markdown --save
'''
在post.js内引入markdown,并在Post.get方法内解析markdown语法为html

###12. 添加文件上传功能
```
npm install multer --save
```
添加upload.ejs模板页,并添加对应的/upload.get和/upload.post。
在index.js内引用multer模块,并在/upload.post内处理文件上传请求。upload.ejs内form的enctype必须为multipart/form-data,index.js内的storage变量内通过multer.diskStorage指定了存储图片的路径和文件名。

###13. 实现用户页面和文章页面
修改post.js内的Post.get为Post.getAll获取全部文章,并添加Post.getOne获取一篇文章。
在index.js内添加/u/:name.get和/u/:name/:day/:title.get来处理用户页面和文章页面的请求,添加user.ejs和article.ejs作为用户页面和文章页面的模板。