iris.resource(function (self) {
 
 var todos = [];
 var remaining = 0;
 var numTodos = 0;
 
 var Todo = function (id, text, completed) {
  this.id = id;
  this.text = text;
  this.completed = completed;
  this.filter = true;

  this.toggle = function () {
   this.completed = !this.completed;
   if ( this.completed ) --remaining;
   else ++remaining;
   self.notify(self.event.completed, this);
  };
  
  this.remove = function () {
   if ( !this.completed ) --remaining;
   var idx = todos.indexOf(this);
   todos.splice(idx, 1);
   self.notify(self.event.remove, this);  
  }
  
  this.edit = function (text) {
   this.text = text;
  };
  
  this.toJSON = function () {
   return JSON.stringify({id: this.id, text: this.text, completed: this.completed});
  }
 };
 
 self.event = {
  add: "todo:add",
  remove: "todo:remove",
  completed: "todo: completed",  
  edit: "todo: edit",
  allCompleted: "todos: completed",
  filter: "todos: filter"
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
 
 self.init = function init() {
  todos = [];
  remaining = 0;
  numTodos = 0;
  return self;
 };
 
 self.addTodo = function addTodo(text) {
  remaining++;
  numTodos++;
  var todo = new Todo(numTodos, text, false);
  todos.push(todo);
  self.notify(self.event.add, todo);
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
    todos[i].completed = completed;
   }
  }
  remaining = ( completed ) ? 0 : todos.length;
  self.notify(self.event.allCompleted, todos);
 };
 
 self.removeCompleted = function () {
  for ( var i = todos.length-1; i >= 0 ; i-- ) {
   if (todos[i].completed) {
    var todo = todos[i];
    todos.splice(i, 1);
    self.notify(self.event.remove, todo);
   }
  }
 };
 
 function applyFilter (todo, filter) {
  todo.filter = filter === "all" 
  || (todo.completed && filter === "completed") 
  || (!todo.completed && filter === "active");
 }
 
 self.filter = function (filter) {
  for (var i = 0; i < todos.length; i++ ) {
   applyFilter(todos[i], filter);
   self.notify(self.event.filter, todos[i]);
  }
 };

 self.getTodo = function(pos) {
  return todos[pos];
 }

}, iris.path.todosModel);