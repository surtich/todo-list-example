iris.ui(function (self) {

 var mediator = iris.resource(iris.path.mediator); 
 var todo = null;
 
 
 self.create = function() {

  todo = self.setting("todo");
  
  self.tmplMode(self.APPEND);
  self.tmpl(iris.path.todo.html);

  self.get("check").on("click", function () {
   mediator.toggle(self, todo);
  });

  self.get("destroy").on("click", function () {
   mediator.remove(self, todo);
  });

  self.get().on("dblclick", function () {
   self.get().addClass("editing");
   self.get("text").select();
  });

  self.get("text").on("blur change", function (e) {
   self.get().removeClass("editing");
   if ( this.value.trim() !== "" ) {
    mediator.edit(todo, self, this.value);
   }
   else this.value = todo.text;
  });

  self.get().hide().fadeIn("slow");
  
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
