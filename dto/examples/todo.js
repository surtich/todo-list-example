var dto = require('../dto');


//Nested
dto.use("mongodb", {
  uri: "mongodb://127.0.0.1:27017/todoDB",
  safe: true,
  onConnect: function(err, db) {
      if (err) {
        console.log("Error:", err);
      } else {
        var collection = db.collection("todos");
        collection.insert({"text":"test"}, {w:1}, function(err, result) {
          console.log("Done!", result);
        });  
      }
    }
});


//Async
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
function(err, result){
    if (err) {
      console.log("Error:", err);
    } else {
      console.log("Done!", result);
    }
});



//Promises
dto.use("mongodb", {
  uri: "mongodb://127.0.0.1:27017/todoDB",
  safe: true
}).col("todos", function(db) {
  console.log("ok")
}, function(err) {
  console.log("ko",err)
}).query(function(col, ok, ko) {
  col.insert({"text":"test3"}, {w:1}, function(err, result) {
    if (err) {
      ko(err);
    } else {
      console.log("Done!", result);
      ok(result);  
    }
  });
}, function(err) {
  console.log("ko2",err)
}).query(function(col, ok) {
  console.log("ok3")
  ok()
}, function(err) {
  console.log("ko3",err)
}).query(function(col, ok, ko) {
  col.insert({"text":"test3Bis"}, {w:1}, function(err, result) {
    if (err) {
      ko(err);
    } else {
      console.log("Done!", result);
      ok(result);  
    }
  });
}, function(err) {
  console.log("ko2",err)
});


//Promises without error handlers
dto.use("mongodb", {
  uri: "mongodb://127.0.0.1:27017/todoDB",
  safe: true
}).col("todos").query(function(col, ok, ko) {
  col.insert({"text":"test4"}, {w:1}, function(err, result) {
    ok(result);  
  });
}).query(function(col, ok, ko) {
  col.insert({"text":"test4bis"}, {w:1}, function(err, result) {
    ok(result);  
  });
}).query(function(col, ok, ko) {
  console.log("Test4 inserted two records");
  ok(result);  ;
});

//Promises unchained
var db = dto.use("mongodb", {
  uri: "mongodb://127.0.0.1:27017/todoDB",
  safe: true
});

var col = db.col("todos");

var query5_1 = col.query(function(col, ok, ko) {
  col.insert({"text":"test5_1"}, {w:1}, function(err, result) {
    console.log(result);
    ok(result);  
  });
});


var query5_1_1 = query5_1.query(function(col, ok, ko) {
  col.insert({"text":"test5_1_1"}, {w:1}, function(err, result) {
    console.log(result);
    ok(result);  
  });
});

var query5_1_1_1 = query5_1_1.query(function(col, ok, ko) {
  col.insert({"text":"test5_1_1_1"}, {w:1}, function(err, result) {
    console.log(result);
    ok(result);  
  });
});


var query5_2 = col.query(function(col, ok, ko) {
  col.insert({"text":"test5_2"}, {w:1}, function(err, result) {
    console.log(result);
    ok(result);  
  });
});