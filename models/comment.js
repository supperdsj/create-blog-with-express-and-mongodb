var mongodb = require('./db');

module.exports = Comment;

function Comment(name, day, title, comment) {
    this.name = name;
    this.day = day;
    this.title = title;
    this.comment = comment;
}
//存储一条留言
Comment.prototype.save = function (callback) {
    var
        name = this.name,
        day = this.day,
        title = this.title,
        comment = this.comment;
    console.log(this);
//打开数据库
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }
        //读取posts
        db.collection('posts', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }
            collection.update({
                'name': name,
                'time.day': day,
                'title': title
            }, {$push: {'comments': comment}}, function (err, doc) {
                mongodb.close();
                if (err) {
                    return callback(err);
                }
                callback(null);
            })
        })
    })
};