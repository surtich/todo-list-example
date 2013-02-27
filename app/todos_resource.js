iris.resource(function (self) {
 
 var todos = [];
 var remaining = 0;
 var numTodos = 0;
 var currentFilter = "all";

 self.init = function init() {
  todos = [];
  remaining = 0;
  numTodos = 0;
  currentFilter = "all";
  return self;
 };
 
 self.loadTodos = function loadTodos(models) {
  todos = [];
  var maxId = 0;
  remaining = 0;
  for (var i = 0; i < models.length; i++) {
   if (models[i].id > maxId) {
    maxId = models[i].id;
   }
   if (!models[i].completed) {
    remaining++;
   }
   var todo = new Todo(models[i].id, models[i].text, models[i].completed);
   todos.push(todo);
  }
  numTodos = maxId;
  return self;
 };
 
 
 self.addTodo = function addTodo(text) {
  remaining++;
  numTodos++;
  var todo = new Todo(numTodos, text, false);
  todos.push(todo);
  return todo;
 };
 
 self.remainingCount = function remainingCount() {
  return remaining;
 };
 
 self.completedCount = function completedCount() {
  return todos.length - remaining;
 };
 
 self.count = function count() {
  return todos.length;
 };
 
 self.setAll = function (completed) {
  for (var i = 0; i < todos.length; i++ ) {
   if ( todos[i].completed !== completed ) {
    todos[i].toggle(completed);
   }
  }
};
 
 self.removeCompleted = function () {
  var removed = [];
  for ( var i = todos.length-1; i >= 0 ; i-- ) {
   if (todos[i].completed) {
    var todo = todos[i];
    removed.push(todo);
    todos.splice(i, 1);
   }
  }
  return removed;
 };
 
 function applyFilter (todo, filter) {
  todo.filter = filter === "all" 
  || (todo.completed && filter === "completed") 
  || (!todo.completed && filter === "active");
 }
 
 self.filter = function (filter) {
  currentFilter = filter;
  for (var i = 0; i < todos.length; i++ ) {
   applyFilter(todos[i], currentFilter);
  }
 };

 self.getTodo = function(pos) {
  return todos[pos];
 }
 
  var Todo = function (id, text, completed) {
  this.id = id;
  this.text = text;
  this.completed = completed;
  applyFilter(this, currentFilter);

  this.toggle = function (completed) {
   if (completed !== undefined) {
    this.completed = completed;
   } else {
    this.completed = !this.completed;
   }
   if ( this.completed ) --remaining;
   else ++remaining;
   applyFilter(this, currentFilter);
  };
  
  this.remove = function () {
   if ( !this.completed ) --remaining;
   var idx = todos.indexOf(this);
   todos.splice(idx, 1);
  }
  
  this.edit = function (text) {
   this.text = text;
  };
  
  this.toJSON = function () {
   return JSON.stringify({id: this.id, text: this.text, completed: this.completed});
  }
 };

}, iris.path.todosModel);