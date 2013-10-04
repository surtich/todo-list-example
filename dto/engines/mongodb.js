var url = require('url'),
    dto = require('../dto'),
    mongo = require('mongodb');

exports.connections = {};
exports.deferred = {};

var Mongodb = exports.Mongodb = function Mongodb(config) {
  var self = this;

/*
  if (typeof config.onConnect !== 'function') {
      throw new Error("onConnect callback must be specified in the config parameter.");
  }
*/
  if (config.uri) {
    var uri = url.parse(config.uri, true);
    config.host = uri.hostname;
    config.port = uri.port;

    if (uri.pathname) {
      config.database = uri.pathname.match(/[^/]+$/)[0];
    }

    if (uri.query) {
      dto.mixin(config, uri.query);
    }
  }

  config.host     = config.host     || '127.0.0.1';
  config.port     = config.port     || 27017;
  config.database = config.database || dto.env || 'test';
  config.safe     = (String(config.safe) === 'true'); 


  config.uri = url.format({
    protocol: 'mongodb',
    hostname: config.host,
    port: config.port,
    pathname: '/'+config.database
  });

  config.port = parseInt(config.port, 10);

  this.config = config;

  // If a connection for this URI has already been made, use it.
  if (exports.connections[config.uri]) {
    this.connection = exports.connections[config.uri];
  // Otherwise if an onConnect callback was given, open a new connection.
  } else if (typeof config.onConnect === 'function') {
    new mongo.Db(config.database, new mongo.Server(config.host, config.port, {})).open(function(err, db) {
      if (err) {
        return config.onConnect(err, this);
      }

      self.connection = exports.connections[config.uri] = db;

      (function handleDeferredAction(i) {
        if (exports.deferred[config.uri] && i<exports.deferred[config.uri].length) {
          exports.deferred[config.uri][i](config.uri, function() {
              handleDeferredAction(++i);
          });
        } else {
          delete exports.deferred[config.uri];
          config.onConnect(null, db);
        }
      })(0);
    });

  // Failing that, just remember to set `this.connection` when the appropriate connection does get made.
  // This makes it easy to define resources before opening their database connection.
  } else {
    var self = this;

    if (!exports.deferred[config.uri]) {
      exports.deferred[config.uri] = [];
    }

    exports.deferred[config.uri].push(function(uri, callback) {
      self.connection = exports.connections[uri];
      callback();
    });
  }
};

Mongodb.prototype.protocol = 'mongodb';