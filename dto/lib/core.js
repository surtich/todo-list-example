var common = require('./common');
var dto = exports;

dto.engines = require('./engines');

//
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
	dto.connect.call(self, options || {});

	return self;
};

//
// Connect to the resource's storage engine, or one specified by the URI protocol
//
dto.connect = function (/* [uri], [port], [options] */) {

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

  if (!this.engine) {
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
    engine = this.engine || dto.engine;
  }
  this.connection = new(engine)(options);
  return this;
};