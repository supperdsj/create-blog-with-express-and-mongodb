/**
 * Created by dongsj on 16/6/13.
 */
var mongodb = require('./db');
var crypto = require('crypto');

module.exports = User;

function User(user) {
    this.name = user.name;
    this.password = user.password;
    this.email = user.email;
}

//存储用户信息
User.prototype.save = function (callback) {

    var md5 = crypto.createHash('md5'),
        email_MD5 = md5.update(this.email.toLowerCase()).digest('hex'),
        head = 'http://www.gravatar.com/avatar/' + email_MD5 + '?s=48';

    var user = {
        name: this.name,
        password: this.password,
        email: this.email,
        head: head
    };
//打开数据库
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }
        //读取user
        db.collection('users', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }
            //插入数据到user
            collection.insert(user, {safe: true}, function (err, user) {
                mongodb.close();
                if (err) {
                    return callback(err);
                } else {
                    //回调
                    callback(null, user.ops[0]);
                }
            })
        })
    })
};
//读取用户信息
User.get = function (name, callback) {
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }
        db.collection('users', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }
            collection.findOne({name: name}, function (err, user) {
                mongodb.close();
                if (err) {
                    return callback(err);
                } else {
                    callback(null, user);
                }
            })
        })
    })
};