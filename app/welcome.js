iris.screen(function(self) {

 
 //var todos = iris.resource(iris.path.todosModel).init();
 var todos = iris.resource(iris.path.localStorage).init(); 

 self.create = function() {

  self.tmpl(iris.path.welcome.html);
  
  self.get("new-todo").on("keyup", function (e) {
   if ( e.keyCode === 13 && this.value.trim() !== "" ) {
    var todo = todos.addTodo(this.value);
    createTodoUI(todo);
    this.value = "";
    render();
   }
  });

  self.get("toggle-all").on("click", function () {
   var completed = self.get("toggle-all").prop("checked");
   todos.setAll( completed );
   render();
  });

  self.get("clear-completed").on("click", function() {
   todos.removeCompleted();
  });

  $("#filters").find("a").on("click", function (e) {
   $(".selected").removeClass("selected");
   $(this).addClass("selected");
  });
  
  self.on(todos.event.remove, function(todo) {
   self.destroyUI(todo.ui);
   render();
  });
  
  self.on(todos.event.filter, function(todo) {
   todo.ui.render();
  });
  
  self.on(todos.event.completed, function(todo) {
   render();
  });

 for (var i = 0; i < todos.count(); i++) {
  createTodoUI(todos.getTodo(i));
 }
  
  render();
 }

 self.awake = function (params) {
  if ( params !== undefined && params.hasOwnProperty("filter") ) {
   todos.filter(params.filter);
  }
 }

 function render () {

  self.inflate({
   completed: "Clear completed (" + todos.completedCount() + ")",
   remaining: todos.remainingCount()
  });

  self.get("toggle-all").toggle(todos.count() !== 0);
  self.get("footer").toggle(todos.count() !== 0);
  self.get("clear-completed").toggle(todos.completedCount() > 0);
  self.get("toggle-all").prop("checked",todos.remainingCount() === 0);
 }
 
 function createTodoUI(todo) {
  var ui = self.ui("todo-list", iris.path.todo.js, {
   "todo": todo
  });  
  todo.ui = ui;
 }
	
}, iris.path.welcome.js);