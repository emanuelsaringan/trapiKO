var DB_NAME = 'transit-app';

var mongodb = require('mongodb');
var Db = mongodb.Db;
var Server = mongodb.Server;
var Connection = mongodb.Connection;
var BSON = mongodb.BSON;
var ObjectID = mongodb.ObjectID;

JeepProvider = function(host, port) {
  var server = new Server(host, port, {safe:false}, {auto_reconnect:true}, {});
  this.db = new Db(DB_NAME, server);
  this.db.open(function(){});
}

JeepProvider.prototype.getCollection = function(callback) {
  this.db.collection('jeep',
    function(error, jeep_collection) {
      if (error) {
        callback(error);
      } else {
        callback(null, jeep_collection);
      }
    }
  );
}

JeepProvider.prototype.findAll = function(callback) {
  this.getCollection(
    function(error, jeep_collection) {
      if (error) {
        callback(error);
      } else {
        jeep_collection.find({},
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

JeepProvider.prototype.add = function(jeep, callback) {
  this.getCollection(
    function(error, jeep_collection) {
      if (error) {
        callback(error);
      } else {
        jeep.total_votes = 0;
        jeep.amount_raised = 0;
        
        jeep_collection.insert(jeep,
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

exports.JeepProvider = JeepProvider;
