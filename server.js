var flatiron = require('flatiron')
  , connect  = require('connect')
  , app      = flatiron.app;

app.use(flatiron.plugins.http);

// Passes the second argument to `helloworld.attach`.
app.use(require("./plugins/dto"), { "delimiter": "!" } );

app.init(function (err) {
  if (err) {
    console.log(err);
  }
});

app.hello("world");


app.http.before.push(connect.static(__dirname + "/www"));

var port = 8080;

console.log('Flatiron Listening at port ' + port);
app.start(port);

