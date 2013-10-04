var common = require('./common');
var dto = exports;

dto.engines = require('./engines');


// Select a storage engine
//
dto.use = function (engine, options) {
  var self = {};
  if (typeof(engine) === "string") {
    engine = common.capitalize(engine);
    if (dto.engines[engine]) {
     self.engine = dto.engines[engine];

   }
   else {
     throw new Error("unrecognised engine: " + engine);
   }
 }
 else if (typeof engine === 'function') {
  self.engine = engine;
}
else {
  throw new Error("invalid engine ");
}

self.key = self.engine.key || 'id';
return dto.connect.call(self, options || {});
};

//
// Connect to the resource's storage engine, or one specified by the URI protocol
//
dto.connect = function (/* [uri], [port], [options] */) {

  var self = this;

  var args = Array.prototype.slice.call(arguments),
  options = {},
  protocol,
  engine,
  m;

  args.forEach(function (a) {
    switch (typeof(a)) {
      case 'number': options.port = parseInt(a, 10); break;
      case 'string': options.uri  = a; break;
      case 'object': options      = a; break;
    }
  });

  // Extract the optional 'protocol' if we haven't already selected an engine
  // ex: "couchdb://127.0.0.1" would have "couchdb" as it's protocol.

  if (!self.engine) {
    if (m = options.uri && options.uri.match(/^([a-z]+):\/\//)) {
      protocol = common.capitalize(m[1]);
      if (dto.engines[protocol]) {
        engine = dto.engines[protocol];
      }
      else {
        throw new Error("unrecognised engine: " + engine);
      }
    }
  }
  else {
    engine = self.engine || dto.engine;
  }

  var onConnect = options.onConnect;

  var deferredDB = common.Q.defer();
  options.onConnect = function(err, db) {

    if (err) {
      deferredDB.reject(new Error(err));
    } else {
      if  (onConnect) {
        onConnect(err, db);  
      }
      deferredDB.resolve(db);
    }
    
  };

  var col = function(colName, callback, error) {

    var client = null;

    var query = function(deferredParent, callback, error) {
      var ok = function(results) {
        deferredQuery.resolve(client);
      };

      var ko = function(err) {
        deferredQuery.reject(new Error(err));
      };
      var deferredQuery = common.Q.defer();
      deferredParent.promise.then(function() {
        callback && callback(client, ok, ko);
      }, function(err) {
        deferredParent.reject(new Error(err));
        deferredQuery.reject(new Error(err));
        error && error(err);
      });

      return {query: query.bind(null, deferredQuery)};
      
    };

    var deferredCol = common.Q.defer();
    deferredDB.promise.then(function(db) {
      callback && callback(db);
      
      self.connection.col(colName, db, function(err, col) {
        if (err) {
          deferredCol.reject(err);
        } else {
          client = col;
          deferredCol.resolve(col);
        }
      });
    }, function(err) {
      deferredCol.reject(new Error(err));
      error && error(err);
    });
    return {query: query.bind(null, deferredCol)};
  };

  self.connection = new(engine)(options);
  return {col: col};
};