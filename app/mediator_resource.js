iris.resource(function (self) {
 
    self.config = function (screen) {
        self.screen = screen;
        iris.resource(iris.path.todosModel).Model.decorators.mediator = {                        
            init: function(models) {
                var todos = this._super.init(models);
                self.uis = [];
                if (todos != undefined) {
                    for (var i = 0; i < todos.length; i++) {
                        createTodoUI(todos[i]);
                    }    
                }
                self.screen.render();
                return todos;
            },
            addTodo: function (text) {
                var todo = this._super.addTodo(text);                
                createTodoUI(todo);
                self.screen.render();
                return todo;
            },
            setAll: function (completed) {
                var todos = this._super.setAll(completed);
                for (var i = 0; i < self.uis.length; i++) {
                    self.uis[i].render();
                }
                self.screen.render();
                return todos;
            },
            removeCompleted: function () {
                var removed = this._super.removeCompleted();
                for (var i = 0; i < removed.length; i++) {
                    self.screen.destroyUI(removed[i].ui);
                }
                self.screen.render();
                return removed;
            },
            filter: function(filter) {
                var currentFilter = this._super.filter(filter);
                for (var i = 0; i < self.uis.length; i++) {
                    self.uis[i].render();
                }
                return currentFilter;
            },
            toggle: function(todo) {
                this._super.toggle(todo);
                todo.ui.render();
                self.screen.render();
            },
            remove: function(todo) {
                this._super.remove(todo);
                self.screen.destroyUI(todo.ui);
                self.screen.render();
                return todo;
            },
            edit: function(todo, text) {
                this._super.edit(todo, text);
                todo.ui.render();
            }
        }
        
    };
 
    function createMediatorMethods(Mediator) {
      
        
 
        
 
 
    }
 
    function createTodoUI(todo) {
        var ui = self.screen.ui("todo-list", iris.path.todo.js, {
            todo: todo
        });
        todo.ui = ui;
        ui.render();
        self.uis.push(ui);
    }
 
}, iris.path.mediator);