/**
 * Created by dongsj on 16/6/12.
 */
var settings=require('../setting');
var db=require('mongodb').db;
var connection=require('mongodb').Connection;
var server=require('mongodb').Server;
module.exports=new DB(settings.db,new Server(settings.host,settings.port),{save:true});