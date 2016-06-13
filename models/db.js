/**
 * Created by dongsj on 16/6/12.
 */
var settings=require('../setting');
var Db=require('mongodb').Db;
var Connection=require('mongodb').Connection;
var Server=require('mongodb').Server;
module.exports=new Db(settings.db,new Server(settings.host,settings.port),{save:true});