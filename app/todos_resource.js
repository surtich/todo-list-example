iris.resource(function (self) {
    var todos = [];
    var remaining = 0;
    var numTodos = 0;
    var currentFilter = "all";
  
    self.config = function (data) {
        self.Model = iris.resource(iris.path.decorable).createComponentDecorable();
        createDecorableMethods(self.Model);
        
        iris.resource(iris.path.mediator).config(data);
        iris.resource(iris.path.localStorage).config(data);
        iris.resource(iris.path.logger).config(data);
        iris.resource(iris.path.testDecorator).config(data);
        
        self.model = new self.Model().decorate('mediator').decorate('localStorage').decorate('logger');
        createNoDecorableMethods(self.model);
 
        return self.model;
    };
 
    function createDecorableMethods(Model) {
        Model.prototype.init = function init(models) {
            todos = [];
            var maxId = 0;
            remaining = 0;
            currentFilter = "all";
            if (models !== undefined) {
                for (var i = 0; i < models.length; i++) {
                    if (models[i].id > maxId) {
                        maxId = models[i].id;
                    }
                    if (!models[i].completed) {
                        remaining++;
                    }
                    var todo = new Todo(models[i].id, models[i].text, models[i].completed);
                    todos.push(todo);
                }
            }
            numTodos = maxId;
            return todos;
        };
        
        Model.prototype.addTodo = function(text) {
            remaining++;
            numTodos++;
            var todo = new Todo(numTodos, text, false);
            todos.push(todo);
            return todo;
        };
        
        Model.prototype.setAll = function(completed) {
            for (var i = 0; i < todos.length; i++ ) {
                if ( todos[i].completed !== completed ) {
                    this.toggle(todos[i], completed);
                }
            }
            return todos;
        };
        
        Model.prototype.removeCompleted = function() {
            var removed = [];
            for ( var i = todos.length-1; i >= 0 ; i-- ) {
                if (todos[i].completed) {
                    var todo = todos[i];
                    removed.push(todo);
                    todos.splice(i, 1);
                }
            }
            return removed;
        };
        
        Model.prototype.filter = function(filter) {
            var newFilter = "none";
            if (filter === "all" || filter === "completed" || filter === "active") {
                newFilter = filter;
            } else if (filter === undefined) {
                newFilter = "all";
            }
            if (newFilter !== currentFilter) {
                currentFilter = newFilter;
                for (var i = 0; i < todos.length; i++ ) {
                    applyFilter(todos[i], currentFilter);
                }
            }
            return currentFilter;
        };
        
        Model.prototype.toggle = function(todo, completed) {
            if (completed !== undefined) {
                todo.completed = completed;
            } else {
                todo.completed = !todo.completed;
            }
            if ( todo.completed ) --remaining;
            else ++remaining;
            applyFilter(todo, currentFilter);
        };
        
        Model.prototype.remove = function (todo) {
            if ( !todo.completed ) --remaining;
            var idx = todos.indexOf(todo);
            todos.splice(idx, 1);
        };
        
        Model.prototype.edit = function(todo, text) {
            todo.text = text;
        };
        
        
    }
    
    function createNoDecorableMethods(model) {
        
        
        model.remainingCount = function remainingCount() {
            return remaining;
        };
 
        model.completedCount = function completedCount() {
            return todos.length - remaining;
        };
 
        model.count = function count() {
            return todos.length;
        };
 
        model.getAll = function getAll() {
            return todos;
        };
        
        model.getTodo = function getTodo(pos) {
            return todos[pos];
        };
    }
    
    
 
    function applyFilter (todo, filter) {
        todo.filter = filter === "all" 
        || (todo.completed && filter === "completed") 
        || (!todo.completed && filter === "active");
    }
 
    var Todo = function Todo(id, text, completed) {
        this.id = id;
        this.text = text;
        this.completed = completed;
        applyFilter(this, currentFilter);
  
        this.toJSON = function () {
            return JSON.stringify({
                id: this.id, 
                text: this.text, 
                completed: this.completed
            });
        }
    };

}, iris.path.todosModel);