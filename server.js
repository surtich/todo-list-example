var flatiron = require('flatiron')
  , connect  = require('connect')
  , app      = flatiron.app;

app.use(flatiron.plugins.http);
app.http.before.push(connect.static(__dirname));

var port = 8080;

console.log('Flatiron Listening at port ' + port);
app.start(port);