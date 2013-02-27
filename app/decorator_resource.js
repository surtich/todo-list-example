iris.resource(function (self) {
 
 self.createComponentDecorator = function() {
  var Component = new Function();
  inherit(Component, Decorator);
  Component.decorators = {};
  return Component;
 }

 function Decorator() {}
 
 self.Decorator = Decorator;
 
 function inherit(C, P) {
  var F = function () {};
  F.prototype = P.prototype;
  C.prototype = new F();
  C._super = P.prototype;
  C.prototype.constructor = C;
 }
 
 
 Decorator.prototype.decorate = function (decorator) {
  var F = function () {},
  overrides = this.constructor.decorators[decorator],
  i, newobj;
  F.prototype = this;
  newobj = new F();
  newobj._super = F.prototype;
  for (i in overrides) {   
   if (overrides.hasOwnProperty(i)) {
    newobj[i] = overrides[i];
   }
  }
  
  //Avoid duplicates calls when a method is not defined in some decorators.
  for (i in newobj._super) {
   if (!newobj.hasOwnProperty(i) && i !== "constructor" && i !== "decorate" ) {
    (function(property) {
     newobj[property] = function() {
      return newobj._super[property].apply(newobj._super, arguments);
     } 
    })(i);
   }
  }
  
  return newobj;
 };
 
}, iris.path.decorator);