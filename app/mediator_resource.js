iris.resource(function (self) {
 
 self.config = function (screen) {
  self.Mediator = iris.resource(iris.path.decorator).createComponentDecorator();
  createMediatorMethods(self.Mediator);
  iris.resource(iris.path.localStorage).config();
  iris.resource(iris.path.logger).config();
  iris.resource(iris.path.testDecorator).config();
 
  self.mediator = new self.Mediator().decorate('localStorage').decorate('logger');

  self.screen = screen;
  
  return self.mediator;
 };
 
 function createMediatorMethods(Mediator) {
  Mediator.prototype.addTodo = function (text) {
   var todo = self.model.addTodo(text, self.currentFilter);
   createTodoUI(todo);
   self.screen.render(self.model);
   return todo;
  };
 
  Mediator.prototype.setAll = function (completed) {
   var todos = self.model.setAll(completed);
   for (var i = 0; i < self.uis.length; i++) {
    self.uis[i].render();
   }
   self.screen.render();
   return todos;
  };
 
  Mediator.prototype.removeCompleted = function () {
   var removed = self.model.removeCompleted();
   for (var i = 0; i < removed.length; i++) {
    self.screen.destroyUI(removed[i].ui);
   }
   self.screen.render();
   return removed;
  };
 
  Mediator.prototype.filter = function(filter) {
   var currentFilter = self.model.filter(filter);
   for (var i = 0; i < self.uis.length; i++) {
    self.uis[i].render();
   }
   return currentFilter;
  };
 
  Mediator.prototype.toggle = function(ui, todo) {
   todo.toggle();
   ui.render();
   self.screen.render();
  };
 
  Mediator.prototype.remove = function(ui, todo) {
   todo.remove();
   self.screen.destroyUI(ui);
   self.screen.render();
   return todo;
  };
 
  Mediator.prototype.edit = function(todo, ui, text) {
   todo.edit(text);
   ui.render();
  };
 
 
  Mediator.prototype.init = function(models) {
   var todos_resource = iris.resource(iris.path.todosModel).init(models); 
   self.model = todos_resource;
   self.uis = [];
   this.model = todos_resource;
   var todos = todos_resource.getAll();
   for (var i = 0; i < todos.length; i++) {
    createTodoUI(todos[i]);
   }
   self.screen.render();
  };
 }
 
 function createTodoUI(todo) {
  var ui = self.screen.ui("todo-list", iris.path.todo.js, {
   todo: todo
  });
  todo.ui = ui;
  ui.render();
  self.uis.push(ui);
 }
 
}, iris.path.mediator);