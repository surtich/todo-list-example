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
 localStorage: "local_storage_resource.js"
};


$(document).ready(
 function () {
  iris.baseUri("./app/");
  iris.welcome(iris.path.welcome.js);
 }
 );
