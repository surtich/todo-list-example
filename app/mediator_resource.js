iris.resource(function (self) {

 self.init = function(screen) {
  var todos = iris.resource(iris.path.todosModel).init(); 
  self.model = todos;
  self.screen = screen;
  self.screen.todos = todos;
  self.uis = [];
  screen.render();
  return self;
 };
 
 self.addTodo = function(text) {
  var todo = self.model.addTodo(text, self.currentFilter);
  createTodoUI(todo);
  self.screen.render(self.model);
 };
 
 self.setAll = function (completed) {
  self.model.setAll(completed);
  for (var i = 0; i < self.uis.length; i++) {
   self.uis[i].render();
  }
  self.screen.render();
 };
 
 self.removeCompleted = function () {
  var removed = self.model.removeCompleted();
  for (var i = 0; i < removed.length; i++) {
   self.screen.destroyUI(removed[i].ui);
  }
  self.screen.render();
 };
 
 self.filter = function(filter) {
  self.model.filter(filter);
  for (var i = 0; i < self.uis.length; i++) {
   self.uis[i].render();
  }
 };
 
 self.toggle = function(ui, todo) {
  todo.toggle();
  ui.render();
  self.screen.render();
 };
 
 self.remove = function(ui, todo) {
  todo.remove();
  self.screen.destroyUI(ui);
  self.screen.render();
 };
 
 self.edit = function(todo, self, text) {
  todo.edit(text);
  self.render();
 };
 
 function createTodoUI(todo) {
  var ui = self.screen.ui("todo-list", iris.path.todo.js, {
   todo: todo
  });
  todo.ui = ui;
  ui.render();
  self.uis.push(ui);
 }
 
}, iris.path.mediator);
