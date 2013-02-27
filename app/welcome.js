iris.screen(function(self) {

 var mediator = iris.resource(iris.path.mediator); 

 self.create = function() {
  self.tmpl(iris.path.welcome.html);
  mediator.init(self);
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

  $("#filters").find("a").on("click", function (e) {
   $(".selected").removeClass("selected");
   $(this).addClass("selected");
  });
 }
 
 self.render = function() {
  render();
 };

 self.awake = function (params) {
  if ( params !== undefined && params.hasOwnProperty("filter") ) {
   mediator.filter(params.filter);
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