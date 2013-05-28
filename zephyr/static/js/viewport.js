var viewport = (function () {
var exports = {};

var jwindow;
var height;
var width;
var in_stoppable_autoscroll = false;

exports.at_top = function () {
    return (jwindow.scrollTop() <= 0);
};

exports.at_bottom = function () {
    // outerHeight(true): Include margin
    var bottom = jwindow.scrollTop() + jwindow.height();
    var window_size = $(document).height();

    return bottom >= window_size;
};

exports.scrollTop = function viewport_scrollTop () {
    return jwindow.scrollTop.apply(jwindow, arguments);
};

exports.height = function viewport_height() {
    if (arguments.length !== 0) {
        height = undefined;
        return jwindow.height.apply(jwindow, arguments);
    }
    if (height === undefined) {
        height = $(window).height();
    }
    return height;
};

exports.width = function viewport_width() {
    if (arguments.length !== 0) {
        width = undefined;
        return jwindow.width.apply(jwindow, arguments);
    }
    if (width === undefined) {
        width = jwindow.width();
    }
    return width;
};


exports.stop_auto_scrolling = function() {
    if (in_stoppable_autoscroll) {
        $("html, body").stop();
    }
};

exports.system_initiated_animate_scroll = function (scroll_amount) {
    suppress_scroll_pointer_update = true; // Gets set to false in the scroll handler.
    var viewport_offset = exports.scrollTop();
    in_stoppable_autoscroll = true; 
    $("html, body").animate({
        scrollTop: viewport_offset + scroll_amount,
        always: function () {
            in_stoppable_autoscroll = false;
        }
    });
};

exports.user_initiated_animate_scroll = function (scroll_amount) {
    suppress_scroll_pointer_update = true; // Gets set to false in the scroll handler.
    in_stoppable_autoscroll = false; // defensive

    var viewport_offset = exports.scrollTop();

    // We use $('html, body') because you can't animate window.scrollTop
    // on Chrome (http://bugs.jquery.com/ticket/10419).
    $("html, body").animate({
        scrollTop: viewport_offset + scroll_amount
    });
};

$(function () {
    jwindow = $(window);
    // This handler must be placed before all resize handlers in our application
    jwindow.resize(function () {
        height = undefined;
        width = undefined;
    });
});

return exports;
}());
