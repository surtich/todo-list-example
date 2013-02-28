iris.resource(function (self) {
 
 self.config = function() {
  iris.resource(iris.path.todosModel).Model.decorators.test = {
   test: function() {
    alert("test");
   }
  };
 }
 
}, iris.path.testDecorator);