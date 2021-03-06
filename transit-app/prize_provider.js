var DB_NAME = 'transit-app';

var mongodb = require('mongodb');
var Db = mongodb.Db;
var Server = mongodb.Server;
var Connection = mongodb.Connection;
var BSON = mongodb.BSON;
var ObjectID = mongodb.ObjectID;

PrizeProvider = function(host, port) {
  var server = new Server(host, port, {safe:false}, {auto_reconnect:true}, {});
  this.db = new Db(DB_NAME, server);
  this.db.open(function(){});
}

PrizeProvider.prototype.getCollection = function(callback) {
  this.db.collection('prize',
    function(error, prize_collection) {
      if (error) {
        callback(error);
      } else {
        callback(null, prize_collection);
      }
    }
  );
}

PrizeProvider.prototype.findAll = function(callback) {
  this.getCollection(
    function(error, prize_collection) {
      if (error) {
        callback(error);
      } else {
        prize_collection.find({},
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

PrizeProvider.prototype.add = function(prize, callback) {
  this.getCollection(
    function(error, prize_collection) {
      if (error) {
        callback(error);
      } else {
        prize.date_posted = new Date();
        
        prize_collection.insert(prize,
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

exports.PrizeProvider = PrizeProvider;
