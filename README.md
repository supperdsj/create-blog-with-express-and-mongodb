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

###14. 实现编辑删除文章
在post.js的Post.update和Post.remove方法,并在index.js内添加/edit/:name/:day/:title.get、/edit/:name/:day/:title.post和/remove/:name/:day/:title.get处理编辑和删除相关请求,修改article.ejs添加编辑和删除按钮,添加edit.ejs模板页实现编辑功能

###15. 实现留言功能
添加comment.js实现留言功能,添加comment.ejs模板页显示留言并在article.ejs内引用,在index.js内添加/u/:name/:day/:title.post处理留言请求。

###16. 添加文章分页功能
在post.js内添加Post.getTen方法用于显示10条数据,在index.js内修改Post.getAll为Post.getTen显示分页数据,添加paging.ejs用于显示分页功能并于index.ejs和user.ejs内引用。

###17. 添加文章存档页面
在post.js内添加Post.getArchive获取文章列表,在index.js内添加/archive.get处理存档页,添加archive.ejs作为存档模板页。

###18. 添加标签功能
添加标签功能:在post.ejs和edit.ejs内添加输入标签功能,在index.js的/post.post内添加提交时的标签处理,在post.js内进行修改支持提交页面时对标签的处理。
添加标签页:在header.ejs内添加标签链接,新建post.ejs模板显示标签列表,在index.js内添加/tags.get处理标签列表的显示,在post.js内添加Post.getTags来显示标签。
添加标签下文章页:在post.js内添加Post.getTag显示特定标签的文章列表,在index.js内添加/tages/:tag.get显示特定标签文章列表,添加tag.ejs作为显示特定标签文章列表的模板页。

###19. 添加pv统计和留言统计
在post.js内修改Post.prototype.save添加初始化pv:0,在post.js内修改getOne来增加阅读时的pv,在index.ejs、user.ejs和article.ejs内添加pv统计和留言统计的显示。

###20. 添加搜索功能
在header.ejs内添加搜索form表单,在post.js内添加Post.search使用正则查询标题返回搜索结果,在index.js内添加/search.get响应路由,添加search.ejs作为搜索结果的模板。

###21. 添加友情链接
在header.ejs内添加友情链接的链接,新建links.ejs作为友情链接的模板页,在index.js内实现友情链接的路由/links.get。

###22. 添加404页面
添加404.ejs显示404页面,在index.js内添加对没有找到页面的处理。

###23. 添加用户头像
在user.js内对User.prototype.save进行修改来生成随机头像,在index.js内修改/post.post显示头像,修改index.ejs和user.ejs来显示头像,修改index.js内的/u/:name/:day/:title.post来为没有头像的用户显示头像,修改comment.ejs显示头像。

###24. 添加日志
在app.js内添加日志打印到access.log和error.log。