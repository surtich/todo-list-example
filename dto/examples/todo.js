var dto = require('../dto');

var todoDB = dto.use("mongodb", {
  uri: "mongodb://127.0.0.1:27017/todoDB",
  safe: true,
  onConnect: function(err, db) {
      var collection = db.collection("todos");
      collection.insert({"text":"test"}, {w:1}, function(err, result) {
        console.log("Done!", result);
      });
    }
});

dto.async.waterfall([
    function(callback){
      dto.use("mongodb", {
        uri: "mongodb://127.0.0.1:27017/todoDB",
        safe: true,
        onConnect: callback
      });
    },
    function(db, callback){
      var collection = db.collection("todos");
      collection.insert({"text":"test2"}, {w:1}, callback);
    }
],
// optional callback
function(err, result){
    if (err) {
      console.log("Error:", err);
    } else {
      console.log("Done!", result);
      console.log(todoDB2);
    }
});
