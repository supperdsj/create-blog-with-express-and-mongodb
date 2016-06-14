var crypto = require('crypto');

User = require('../models/user');
Post = require('../models/post');

module.exports = function (app) {

    app.get('/reg', checkNotLogin);
    app.post('reg', checkNotLogin);
    app.get('/login', checkNotLogin);
    app.post('/login', checkNotLogin);
    app.get('/post', checkLogin);
    app.post('/post', checkLogin);
    app.get('/logout', checkLogin);

    app.get('/', function (req, res) {
        Post.get(null,function(err,posts){
           if(err){
               posts=[];
           }

            res.render('index', {
                title: '主页',
                user: req.session.user,
                posts:posts,
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
            post = new Post(currentUser.name, req.body.title, req.body.post);
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