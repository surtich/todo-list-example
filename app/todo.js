iris.ui(function (self) {

 var todos = iris.resource(iris.path.todosModel);
 var todo = null;
 
 
 self.create = function() {

  todo = self.setting("todo");
  
  self.tmplMode(self.APPEND);
  self.tmpl(iris.path.todo.html);

  self.get("check").on("click", function () {
   todo.toggle();
   render();
  });

  self.get("destroy").on("click", function () {
   todo.remove();
  });

  self.get().on("dblclick", function () {
   self.get().addClass("editing");
   self.get("text").select();
  });

  self.get("text").on("blur change", function (e) {
   self.get().removeClass("editing");
   if ( this.value.trim() !== "" ) {
    todo.edit(this.value);
    iris.notify(todos.event.edit, todo);
    render();
   }
   else this.value = todo.text;
  });

  self.get().hide().fadeIn("slow");
  
  self.on(todos.event.allCompleted , function () {
   render();
  });
  
  render();
 };
 
 self.render = function() {
  render();
 }
 
 function render () {
  self.get().toggle(todo.filter);
  self.get().toggleClass("completed", todo.completed);
  self.get("check").prop("checked", todo.completed);
  self.inflate(todo);
 };

},iris.path.todo.js);
