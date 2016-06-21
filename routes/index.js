var crypto = require('crypto');

var User = require('../models/user');
var Post = require('../models/post');
var Comment = require('../models/comment');

//https://github.com/expressjs/multer
var multer = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/images/multer');
    },
    filename: function (req, file, cb) {
        console.log(file);
        cb(null, file.originalname);
    }
});
var upload = multer({storage: storage}).array('files');


module.exports = function (app) {
    app.get('/reg', checkNotLogin);
    app.post('reg', checkNotLogin);
    app.get('/login', checkNotLogin);
    app.post('/login', checkNotLogin);
    app.get('/post', checkLogin);
    app.post('/post', checkLogin);
    app.get('/logout', checkLogin);
    app.get('/upload', checkLogin);
    app.post('/upload', checkLogin);
    app.get('/edit/:name/:day/:title', checkLogin);
    app.post('/edit/:name/:day/:title', checkLogin);
    app.get('/remove/:name/:day/:title', checkLogin);
    app.get('/', function (req, res) {
        var page = req.query.p ? parseInt(req.query.p) : 1;
        Post.getTen(null, page, function (err, posts, total) {
            if (err) {
                posts = [];
            }
            console.log(page);
            res.render('index', {
                title: '主页',
                user: req.session.user,
                posts: posts,
                page: page,
                isFirstPage: (page - 1) == 0,
                isLastPage: ((page - 1) * 10 + posts.length) == total,
                success: req.flash('success').toString(),
                error: req.flash('error').toString()
            });
        });
    });
    app.get('/reg', function (req, res) {
        res.render('reg', {
            title: '注册',
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        });
    });
    app.post('/reg', function (req, res) {
        var name = req.body.name,
            password = req.body.password,
            password_re = req.body['password-repaeat'];
        if (password == password_re) {
            console.log('两次密码输入不一致');
            req.flash('error', '两次密码输入不一致');
            return res.redirect('/reg');
        }
        //生成密码md5
        var md5 = crypto.createHash('md5'),
            password = md5.update(req.body.password).digest('hex');
        var newUser = new User({
            name: req.body.name,
            password: password,
            email: req.body.email
        });
        //检查用户是否已存在
        User.get(newUser.name, function (err, user) {
            if (err) {
                req.flash('error', err);
                return res.redirect('/');
            }
            if (user) {
                req.flash('error', '用户已存在!');
                return res.redirect('/reg');
            }
            //不存在就新增账户
            newUser.save(function (err, user) {
                if (err) {
                    console.log(err);
                    req.flash('error', err);
                    return res.redirect('/reg');
                }
                //存入session
                req.session.user = user;
                console.log(req.session.user);
                req.flash('success', '注册成功!');
                res.redirect('/');
            });
        });
    });
    app.get('/login', function (req, res) {
        res.render('login', {
            title: '登录',
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        });
    });
    app.post('/login', function (req, res) {
        var md5 = crypto.createHash('md5'),
            password = md5.update(req.body.password).digest('hex');
        User.get(req.body.name, function (err, user) {
            if (!user) {
                req.flash('error', '用户不存在!');
                return res.redirect('/login');
            }
            if (user.password != password) {
                req.flash('error', '密码错误!');
                return res.redirect('/login');
            }
            req.session.user = user;
            req.flash('success', '登录成功!');
            res.redirect('/');
        })
    });
    app.get('/post', function (req, res) {
        res.render('post', {
            title: '发表',
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        });
    });
    app.post('/post', function (req, res) {
        var currentUser = req.session.user,
            tags = [req.body.tag1, req.body.tag2, req.body.tag3],
            post = new Post(currentUser.name, req.body.title, tags, req.body.post);
        post.save(function (err) {
            if (err) {
                req.flash('error', err);
                return res.redirect('/');
            } else {
                req.flash('success', '发布成功!');
                res.redirect('/');
            }
        })
    });
    app.get('/upload', function (req, res) {
        res.render('upload', {
            title: '上传文件',
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        })
    });
    app.post('/upload', function (req, res) {
        upload(req, res, function (err) {
            if (err) {
                console.log(err);
                req.flash('error', '文件上传失败');
            } else {
                console.log(req.body);
                req.flash('success', '文件上传成功');
            }
            res.redirect('/upload');
        });
    });
    app.get('/u/:name', function (req, res) {
        var page = req.query.p ? parseInt(req.query.p) : 1;
        User.get(req.params.name, function (err, user) {
            if (!user) {
                req.flash('error', '用户不存在!');
                return res.redirect('/');
            }
            Post.getTen(user.name, page, function (err, posts, total) {
                if (err) {
                    req.flash('error', err);
                    return res.redirect('/');
                }
                console.log(page);
                res.render('user', {
                    title: user.name,
                    posts: posts,
                    user: req.session.user,
                    success: req.flash('success').toString(),
                    error: req.flash('error').toString(),
                    page: page,
                    isFirstPage: (page - 1) == 0,
                    isLastPage: ((page - 1) * 10 + posts.length) == total
                })
            })
        })
    });
    app.get('/u/:name/:day/:title', function (req, res) {
        Post.getOne(req.params.name, req.params.day, req.params.title, function (err, post) {
            if (err) {
                req.flash('error', err);
                return res.redirect('/');
            }
            res.render('article', {
                title: req.params.title,
                post: post,
                user: req.session.user,
                success: req.flash('success').toString(),
                error: req.flash('error').toString()
            })
        })
    });
    app.post('/u/:name/:day/:title', function (req, res) {
        var date = new Date(),
            time = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + (date.getMinutes() < 10 ? ('0' + date.getMinutes()) : date.getMinutes());
        var comment = {
            name: req.body.name,
            email: req.body.email,
            website: req.body.website,
            time: time,
            content: req.body.content
        };
        var newComment = new Comment(req.params.name, req.params.day, req.params.title, comment);
        newComment.save(function (err) {
            if (err) {
                req.flash('error', err);
                return res.redirect('back');
            } else {
                req.flash('success', '留言成功!');
                res.redirect('back');
            }
        })
    });
    app.get('/edit/:name/:day/:title', function (req, res) {
        var currentUser = req.session.user;
        Post.edit(currentUser.name, req.params.day, req.params.title, function (err, post) {
            if (err) {
                req.flash('error', err);
                return res.redirect('back');
            }
            res.render('edit', {
                title: '编辑',
                post: post,
                user: req.session.user,
                success: req.flash('success').toString(),
                error: req.flash('error').toString()
            })
        })
    });
    app.post('/edit/:name/:day/:title', function (req, res) {
        var currentUser = req.session.user;
        Post.update(currentUser.name, req.params.day, req.params.title, req.body.post, function (err) {
            var url = encodeURI('/u/' + req.params.name + '/' + req.params.day + '/' + req.params.title);
            if (err) {
                req.flash('error', err);
                return res.redirect(url);
            }
            req.flash('success', '修改成功!');
            res.redirect(url);
        })
    });

    app.get('/remove/:name/:day/:title', function (req, res) {
        var currentUser = req.session.user;
        Post.remove(currentUser.name, req.params.day, req.params.title, function (err) {
            if (err) {
                req.flash('error', err);
                return res.redirect('back');
            }
            req.flash('success', '删除成功!');
            res.redirect('/');
        })
    });
    app.get('/archive', function (req, res) {
        Post.getArchive(function (err, posts) {
            if (err) {
                req.flash('error', err);
                return res.redirect('/');
            }
            res.render('archive', {
                title: '存档',
                posts: posts,
                user: req.session.user,
                success: req.flash('success').toString(),
                error: req.flash('error').toString()
            });
        });
    });
    app.get('/tags', function (req, res) {
        Post.getTags(function (err, posts) {
            if (err) {
                req.flash('error', err);
                return res.redirect('/');
            }
            res.render('tags', {
                title: '标签',
                posts: posts,
                user: req.session.user,
                success: req.flash('success').toString(),
                error: req.flash('error').toString()
            });
        });
    });
    app.get('/tags/:tag', function (req, res) {
        Post.getTag(req.params.tag,function (err, posts) {
            if (err) {
                req.flash('error', err);
                return res.redirect('/');
            }
            res.render('tag', {
                title: 'TAG:'+req.params.tag,
                posts: posts,
                user: req.session.user,
                success: req.flash('success').toString(),
                error: req.flash('error').toString()
            });
        });
    });
    app.get('/search',function(req,res){
       Post.search(req.query.keyword,function(err,posts){
           if(err){
               req.flash('error',err);
               return res.redirect('/');
           }
           res.render('search',{
               title:'SEARCH:'+req.query.keyword,
               posts:posts,
               user:req.session.user?req.session.user:'',
               success:req.flash('success').toString(),
               error:req.flash('error').toString()
           })
       })
    });
    app.get('/logout', function (req, res) {
        req.session.user = null;
        req.flash('success', '登出成功!');
        res.redirect('/');
    });
};
function checkLogin(req, res, next) {
    if (!req.session.user) {
        req.flash('error', '未登录!');
        res.redirect('/login');
    } else {
        next();
    }
}
function checkNotLogin(req, res, next) {
    if (req.session.user) {
        req.flash('error', '已登录!');
        res.redirect('/login');
    } else {
        next();
    }
}