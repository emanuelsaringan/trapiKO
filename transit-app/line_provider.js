var DB_NAME = 'transit-app';

var mongodb = require('mongodb');
var Db = mongodb.Db;
var Server = mongodb.Server;
var Connection = mongodb.Connection;
var BSON = mongodb.BSON;
var ObjectID = mongodb.ObjectID;

LineProvider = function(host, port) {
  var server = new Server(host, port, {safe:false}, {auto_reconnect:true}, {});
  this.db = new Db(DB_NAME, server);
  this.db.open(function(){});
}

LineProvider.prototype.getCollection = function(callback) {
  this.db.collection('line',
    function(error, line_collection) {
      if (error) {
        callback(error);
      } else {
        callback(null, line_collection);
      }
    }
  );
}

LineProvider.prototype.findAll = function(callback) {
  this.getCollection(
    function(error, line_collection) {
      if (error) {
        callback(error);
      } else {
        line_collection.find({},
          function(error, result) {
            if (error) {
              callback(error);
            } else {
              result.toArray(callback);
            }
          }
        );
      }
    }
  );
};

LineProvider.prototype.add = function(line, callback) {
  this.getCollection(
    function(error, line_collection) {
      if (error) {
        callback(error);
      } else {
        line_collection.insert(line,
          function(error, result) {
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
};

exports.LineProvider = LineProvider;
