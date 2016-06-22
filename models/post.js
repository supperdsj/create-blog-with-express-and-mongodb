/**
 * Created by dongsj on 16/6/14.
 */
var mongodb = require('./db');
var markdown = require('markdown').markdown;

module.exports = Post;

function Post(name,head, title, tags, post) {
    this.name = name;
    this.title = title;
    this.post = post;
    this.tags = tags;
    this.head = head;
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
        post: this.post,
        tags: this.tags,
        head: this.head,
        comments: [],
        pv: 0
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
Post.getTen = function (name, page, callback) {
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
            collection.count(query, function (err, total) {
                collection.find(query, {
                    skip: (page - 1) * 10,
                    limit: 10
                }).sort({time: -1}).toArray(function (err, docs) {
                    mongodb.close();
                    if (err) {
                        return callback(err);
                    }
                    //解析markdown
                    docs.forEach(function (doc) {
                        doc.post = markdown.toHTML(doc.post);
                    });
                    callback(null, docs, total);
                });
            });
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
                'name': name,
                'time.day': day,
                'title': title
            };
            collection.findOne(query, function (err, doc) {
                if (err) {
                    mongodb.close();
                    return callback(err);
                }
                if (doc) {
                    collection.update(query, {$inc: {'pv': 1}}, function (err) {
                        mongodb.close();
                        if (err) {
                            return callback(err);
                        }
                    });
                    //解析markdown
                    doc.post = markdown.toHTML(doc.post);
                    doc.comments.forEach(function (comment) {
                        comment.content = markdown.toHTML(comment.content);
                    });
                    callback(null, doc);
                }
            })
        })
    })
};
//获取文章列表
Post.getArchive = function (callback) {
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }
        db.collection('posts', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }
            collection.find({}, {'name': 1, 'time': 1, 'title': 1}).sort({time: -1}).toArray(function (err, docs) {
                mongodb.close();
                if (err) {
                    return callback(err);
                }
                callback(null, docs);
            })
        })
    })
};

//读取标签信息
Post.getTags = function (callback) {
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }
        db.collection('posts', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }
            //用distinct显示不重复的结果
            collection.distinct('tags', function (err, docs) {
                mongodb.close();
                if (err) {
                    return callback(err);
                }
                callback(null, docs);
            })
        })
    })
};
Post.getTag = function (tag, callback) {
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }
        db.collection('posts', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }
            collection.find({tags: tag}, {name: 1, time: 1, title: 1}).sort({time: -1}).toArray(function (err, docs) {
                mongodb.close();
                if (err) {
                    return callback(err);
                }
                callback(null, docs);
            })
        })
    })
};
//编辑文章
Post.edit = function (name, day, title, callback) {
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
                'name': name,
                'time.day': day,
                'title': title
            };
            collection.findOne(query, function (err, doc) {
                mongodb.close();
                if (err) {
                    return callback(err);
                }
                //解析markdown
                doc.post = markdown.toHTML(doc.post);
                callback(null, doc);
            })
        })
    })
};
//更新文章
Post.update = function (name, day, title, post, callback) {
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
                'name': name,
                'time.day': day,
                'title': title
            };
            collection.update(query, {$set: {post: post}}, function (err) {
                mongodb.close();
                if (err) {
                    return callback(err);
                }
                callback(null);
            })
        })
    })
};
//删除文章
Post.remove = function (name, day, title, callback) {
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
                'name': name,
                'time.day': day,
                'title': title
            };
            collection.remove(query, {w: 1}, function (err) {
                mongodb.close();
                if (err) {
                    return callback(err);
                }
                callback(null);
            })
        })
    })
};

Post.search = function (keyword, callback) {
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }
        db.collection('posts', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }
            var pattern = new RegExp(keyword, 'i');
            collection.find({'title': pattern}, {
                name: 1,
                time: 1,
                title: 1
            }).sort({time: -1}).toArray(function (err, docs) {
                mongodb.close();
                if (err) {
                    return callback(err);
                }
                callback(null, docs)
            });
        })
    })
};