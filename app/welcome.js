iris.screen(function(self) {
 
 var model = null;
 
 function init() {
  model = iris.resource(iris.path.todosModel).config(self);
  model.init();
 }


 self.create = function() {
  self.tmpl(iris.path.welcome.html);
  init();
  
  self.get("new-todo").on("keyup", function (e) {
   if ( e.keyCode === 13 && this.value.trim() !== "" ) {
    model.addTodo(this.value);
    this.value = "";
   }
  });

  self.get("toggle-all").on("click", function () {
   var completed = self.get("toggle-all").prop("checked");
   model.setAll( completed );
  });

  self.get("clear-completed").on("click", function() {
   model.removeCompleted();
  });

 }
 
 self.render = function() {
  render();
 };

 self.awake = function (params) {
  if ( params !== undefined ) {
   var currentFilter = model.filter(params.filter);
   self.get("filters").find(".selected").removeClass("selected");
   self.get("filters").find("[href$='" + currentFilter + "']").addClass("selected");
  }
 }

 function render () {
  self.inflate({
   completed: "Clear completed (" + model.completedCount() + ")",
   remaining: {
      count: model.remainingCount(),
      label: model.remainingCount() === 1 ? "item" : "items"
   },
   hasTodos: model.count() !== 0,
   noRemainingTodos: model.remainingCount() === 0,
   hasRemainings: model.completedCount() > 0
  });
  
  
 }
 
	
}, iris.path.welcome.js);