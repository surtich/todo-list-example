iris.ui(function (self) {

    var model = iris.resource(iris.path.todosModel).model;
    var todo = null;
 
 
    self.create = function() {

        todo = self.setting("todo");
  
        self.tmplMode(self.APPEND);
        self.tmpl(iris.path.todo.html);

        self.get("check").on("click", function () {
            model.toggle(todo);
        });

        self.get("destroy").on("click", function () {
            model.remove(todo);
        });

        self.get().on("dblclick", function () {
            self.get().addClass("editing");
            self.get("text").select();
        });

        self.get("text").on("blur change", function (e) {
            self.get().removeClass("editing");
            if ( this.value.trim() !== "" ) {
                model.edit(todo, this.value);
            }
            else this.value = todo.text;
        });

        self.get().hide().fadeIn("slow");
  
    };
 
    self.render = function() {
        render();
    }
 
    function render () {
        self.get().toggleClass("completed", todo.completed);
        self.inflate(todo);
    };

},iris.path.todo.js);