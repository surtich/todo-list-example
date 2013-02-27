iris.resource(function (self) {
 
 self.config = function() {
  iris.resource(iris.path.mediator).Mediator.decorators.test = {
   test: function() {
    alert("test");
   }
  };
 }
 
}, iris.path.testDecorator);