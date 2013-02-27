iris.path = {
 welcome : {
  js: "welcome.js", 
  html: "welcome.html"
 },
 todo: {
  js: "todo.js", 
  html : "todo.html"
 },
 todosModel : "todos_resource.js",
 mediator: "mediator_resource.js"
};


$(document).ready(
 function () {
  iris.baseUri("./app/");
  iris.welcome(iris.path.welcome.js);
 }
 );
