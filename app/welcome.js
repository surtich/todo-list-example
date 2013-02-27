iris.screen(function(self) {
 
 var mediator = null;
 
 function init() {
  mediator = iris.resource(iris.path.mediator).config(self);
  mediator.init();
 }


 self.create = function() {
  self.tmpl(iris.path.welcome.html);
  init();
  
  self.get("new-todo").on("keyup", function (e) {
   if ( e.keyCode === 13 && this.value.trim() !== "" ) {
    mediator.addTodo(this.value);
    this.value = "";
   }
  });

  self.get("toggle-all").on("click", function () {
   var completed = self.get("toggle-all").prop("checked");
   mediator.setAll( completed );
  });

  self.get("clear-completed").on("click", function() {
   mediator.removeCompleted();
  });

 }
 
 self.render = function() {
  render();
 };

 self.awake = function (params) {
  if ( params !== undefined ) {
   var currentFilter = mediator.filter(params.filter);
   self.get("filters").find(".selected").removeClass("selected");
   self.get("filters").find("[href$='" + currentFilter + "']").addClass("selected");
  }
 }

 function render () {
  self.inflate({
   completed: "Clear completed (" + mediator.model.completedCount() + ")",
   remaining: mediator.model.remainingCount()
  });

  self.get("toggle-all").toggle(mediator.model.count() !== 0);
  self.get("footer").toggle(mediator.model.count() !== 0);
  self.get("clear-completed").toggle(mediator.model.completedCount() > 0);
  self.get("toggle-all").prop("checked",mediator.model.remainingCount() === 0);
  
  
 }
 
	
}, iris.path.welcome.js);