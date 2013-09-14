var DB_NAME = 'transit-app';

var mongodb = require('mongodb');
var Db = mongodb.Db;
var Server = mongodb.Server;
var Connection = mongodb.Connection;
var BSON = mongodb.BSON;
var ObjectID = mongodb.ObjectID;

UserProvider = function(host, port) {
  var server = new Server(host, port, {safe:false}, {auto_reconnect:true}, {});
  this.db = new Db(DB_NAME, server);
  this.db.open(function(){});
}

UserProvider.prototype.getCollection = function(callback) {
  this.db.collection('user',
    function(error, user_collection) {
      if (error) {
        callback(error);
      } else {
        callback(null, user_collection);
      }
    }
  );
}

UserProvider.prototype.findUserByUsername = function(username, callback) {
  this.getCollection(
    function(error, user_collection) {
      if (error) {
        callback(error);
      } else {
        user_collection.findOne({ username: username }, 
          function (error, result) {
            if (error) {
              callback(error);
            } else {
              callback(null, result);
            }
          }
        );
      }
    }
  );
}

exports.UserProvider = UserProvider;
