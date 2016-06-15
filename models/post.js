/**
 * Created by dongsj on 16/6/14.
 */
var mongodb = require('./db');
var markdown = require('markdown').markdown;

module.exports = Post;

function Post(name, title, post) {
    this.name = name;
    this.title = title;
    this.post = post;
}

Post.prototype.save = function (callback) {
    var date = new Date();
    //定义时间格式
    var time = {
        date: date,
        year: date.getFullYear(),
        month: date.getFullYear() + '-' + (date.getMonth() + 1),
        day: date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + (date.getDate()),
        minute: date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + (date.getDate()) + ' ' + date.getHours() + ':' + (date.getMinutes() < 10 ? ('0' + date.getMinutes()) : date.getMinutes())
    };
    var post = {
        name: this.name,
        time: time,
        title: this.title,
        post: this.post
    };
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }
        //读取post集合
        db.collection('posts', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }
            //插入数据到post
            collection.insert(post, {safe: true}, function (err) {
                mongodb.close();
                if (err) {
                    return callback(err);
                } else {
                    //回调
                    callback(null);
                }
            })
        })
    })
};

//读取文章信息
Post.getAll = function (name, callback) {
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }
        db.collection('posts', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }
            var query = {};
            if (name) {
                query.name = name;
            }
            collection.find(query).sort({time: -1}).toArray(function (err, docs) {
                mongodb.close();
                if (err) {
                    return callback(err);
                }
                //解析markdown
                docs.forEach(function (doc) {
                    doc.post = markdown.toHTML(doc.post);
                });
                callback(null, docs);
            })
        })
    })
};
//读取文章信息*1
Post.getOne = function (name, day, title, callback) {
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }
        db.collection('posts', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }
            var query = {
                'name':name,
                'time.day':day,
                'title':title
            };
            collection.findOne(query,function (err, docs) {
                mongodb.close();
                if (err) {
                    return callback(err);
                }
                //解析markdown
                docs.forEach(function (doc) {
                    doc.post = markdown.toHTML(doc.post);
                });
                callback(null, docs);
            })
        })
    })
};