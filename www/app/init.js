// define iris components paths
iris.path = {
	welcome : { js: "welcome.js", html: "welcome.html" },
    todo: { js: "todo.js", html : "todo.html" },
    resource : "resource.js"
};


$(window.document).ready(

    function () {
    	// set the iris components base uri
    	iris.baseUri("app/");

    	// show the initial screen
        iris.welcome(iris.path.welcome.js);
    }
);

(function() {
    $.fn.longTap = function(options) {
        
        options = $.extend({
            delay: 1000,
            onRelease: null
        }, options);
        
        var eventType = {
            mousedown: 'ontouchstart' in window ? 'touchstart' : 'mousedown',
            mouseup: 'ontouchend' in window ? 'touchend' : 'mouseup'
        };
        
        return this.each(function() {
            $(this).on(eventType.mousedown + '.longtap', function() {
                $(this).data('touchstart', +new Date);
            })
            .on(eventType.mouseup + '.longtap', function(e) {
                var now = +new Date,
                    than = $(this).data('touchstart');
                now - than >= options.delay && options.onRelease && options.onRelease.call(this, e);
            });
        });
    };
})(jQuery);