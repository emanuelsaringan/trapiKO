var DB_NAME = 'transit-app';

var mongodb = require('mongodb');
var Db = mongodb.Db;
var Server = mongodb.Server;
var Connection = mongodb.Connection;
var BSON = mongodb.BSON;
var ObjectID = mongodb.ObjectID;

VoterProvider = function(host, port) {
  var server = new Server(host, port, {safe:false}, {auto_reconnect:true}, {});
  this.db = new Db(DB_NAME, server);
  this.db.open(function(){});
}

VoterProvider.prototype.getCollection = function(callback) {
  this.db.collection('voter',
    function(error, voter_collection) {
      if (error) {
        callback(error);
      } else {
        callback(null, voter_collection);
      }
    }
  );
}

VoterProvider.prototype.findAll = function(callback) {
  this.getCollection(
    function(error, voter_collection) {
      if (error) {
        callback(error);
      } else {
        voter_collection.find({},
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

VoterProvider.prototype.add = function(voter, callback) {
  this.getCollection(
    function(error, voter_collection) {
      if (error) {
        callback(error);
      } else {
        voter.total_votes = 0;
        voter.total_amount = 0;
        voter.jeepneys_voted = 0;
        voter.last_vote_dt = 0;
        
        voter_collection.insert(voter,
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

exports.VoterProvider = VoterProvider;
