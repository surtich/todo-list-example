iris.resource(function (self) {
 
 self.config = function() {
  if ( Storage !== undefined) {
   iris.resource(iris.path.mediator).Mediator.decorators.localStorage = {
   
    addTodo: function (text) {
     var todo = this._super.addTodo(text);
     updateTodo(todo);
     return todo;
    },
    setAll: function(completed) {
     var todos = this._super.setAll(completed);
     toggleAll(todos);
     return todos;
    },
    removeCompleted: function() {
     var todos = this._super.removeCompleted();
     for (var i = 0; i < todos.length; i++ ) {
      removeTodo(todos[i]);
     }
     return todos;
    },
    toggle: function(ui, todo) {
     this._super.toggle(ui, todo);
     updateTodo(todo);
    },
    remove: function(ui, todo) {
     this._super.remove(ui, todo);
     removeTodo(todo);
    },
    edit: function(todo, ui, text) {
     this._super.edit(todo, ui, text);
     updateTodo(todo);
    },
    init: function() {
     var models = init();
     this._super.init(models);
    }
   };
  }
 }
 
 function init() {
  var models = [];
  for (var hash in localStorage) {
   if (hash.indexOf("todo") == 0) {
    models.push(JSON.parse(localStorage[hash]));
   }
  }
  return models;
 }

 function updateTodo(todo) {
  localStorage["todo" + todo.id] = todo.toJSON();
 }
 
 function removeTodo(todo) {
  delete localStorage["todo" + todo.id];
 }
 
 function toggleAll(todos) {
  for (var i = 0; i < todos.length; i++) {
   updateTodo(todos[i]);
  }
 }
 
}, iris.path.localStorage);