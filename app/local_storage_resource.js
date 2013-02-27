iris.resource(function (self) {
 
 var todos = iris.resource(iris.path.todosModel);
 
 self.init = function () {
  var models = [];
  if ( Storage !== undefined ) {
   for (var hash in localStorage) {
    if (hash.indexOf("todo") == 0) {
     models.push(JSON.parse(localStorage[hash]));
    }
   }
   
   todos.loadTodos(models);
   
   self.on(todos.event.add, function(todo) {
    updateTodo(todo);
   });

   self.on(todos.event.completed, function(todo) {
    updateTodo(todo);
   });

   self.on(todos.event.edit, function(todo) {
    updateTodo(todo);
   });

   self.on(todos.event.allCompleted, function(todos) {
    for (var i = 0; i < todos.length; i++) {
      updateTodo(todos[i]);
    }
   });

   self.on(todos.event.remove, function(todo) {
    delete localStorage["todo" + todo.id];
   });
  }

  return todos;
 }

 function updateTodo(todo) {
  localStorage["todo" + todo.id] = todo.toJSON();
 }
 
}, iris.path.localStorage);