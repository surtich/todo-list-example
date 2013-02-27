iris.resource(function (self) {
 
 self.config = function() {
  iris.resource(iris.path.mediator).Mediator.decorators.logger = {
  addTodo: function (text) {
   var todo = this._super.addTodo(text);
   console.log("New TODO added id=[" + todo.id + "], text=[" + todo.text + "]"); 
   return todo;
  },
  setAll: function(completed) {
   var todos = this._super.setAll(completed);
   if (completed) {
    console.log("All TODOs have been marked as complete.");
   } else {
    console.log("All TODOs have been marked as unrealized.");
   }
   return todos;
  },
  removeCompleted: function() {
   var todos = this._super.removeCompleted();
   for (var i = 0; i < todos.length; i++ ) {
    var todo = todos[i];
    console.log("TODO removed id=[" + todo.id + "], text=[" + todo.text + "]"); 
   }
   return todos;
  },
  filter: function(filter) {
   var currentFilter = this._super.filter(filter);
   console.log("Active filter is [" + filter+"]"); 
   return currentFilter;
  },
  toggle: function(ui, todo) {
   this._super.toggle(ui, todo);
   if (todo.completed) {
    console.log("The TODO id=[" + todo.id + "], text=[" + todo.text + "] has been completed"); 
   } else {
    console.log("The TODO id=[" + todo.id + "], text=[" + todo.text + "] has been marked as unrealized"); 
   }
  },
  remove: function(ui, todo) {
   this._super.remove(ui, todo);
   console.log("TODO removed id=[" + todo.id + "], text=[" + todo.text + "]"); 
  },
  edit: function(todo, ui, text) {
   this._super.edit(todo, ui, text);
   console.log("TODO updated id=[" + todo.id + "], new text=[" + todo.text + "]"); 
  }
 };
 }
 
}, iris.path.logger);