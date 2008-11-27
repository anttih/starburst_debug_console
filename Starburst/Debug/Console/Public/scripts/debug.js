// 
// Debug console for Solar
// 
// @author Antti Holvikari <anttih@gmail.com>
// 
var Starburst_Debug_Console = function (data) {
        // id of this console
    var id = 'starburst_debug_console',
        
        // tab that will be left open
        default_tab = 'solar_sql',
        
        // list of widgets so that we can iterate over them
        widgets = {},
        
        // registry of widgets
        registry = {};

// 
// Renders the whole widget and all it's components
// 
    function render() {
        var key, spec, w;
        
        // render the console wrapper
        render_console();
        
        // look for keys in the debug payload
        // and render each as a widget
        for (klass in data) {
            // class name to lowercase
            key = klass.toLowerCase();
            if (data.hasOwnProperty(key) && data[key].data) {
                // get a new widget object and render
                w = widgets[key]({
                    'name' : key,
                    'data' : data[key].data
                });
                
                // render widget passing in content div element
                w.render($('#' + id + ' .content'));
                
                // hide if not default
                if (key !== default_tab) {
                    w.hide();
                }
                
                // add to registry
                registry[key] = w;
            }
        }
    }

// 
// Renders wrapper HTML
// 
    function render_console() {
        var item,
            key,
            menu,
            html;
        
        html  = [
            '<div id="starburst_debug_console-open"><a href="#">Open console</a></div>',
            '<div id="' + id + '">',
            '<ul class="tabs"></ul>',
            '<a id="starburst_debug_console-close" href="#">Close</a>',
            '<div class="content"></div>',
            '</div>'
        ].join('');
        
        $(document.body).append(html);
        
        open = $("#starburst_debug_console-open");
        console = $(document.getElementById(id));
        
        // show console
        $("#starburst_debug_console-open a").click(function (open, console) {
            return function () {
                open.toggle();
                console.toggle();
            };
        }(open, console));
        
        // close console
        $("#starburst_debug_console-close").click(function (open, console) {
            return function () {
                console.fadeOut('slow');
                open.fadeIn('slow');
            };
        }(open, console));
        
        // get the list node
        menu = $('#' + id + ' ul');
        
        for (key in widgets) {
            if (widgets.hasOwnProperty(key)) {
                item = '<li id="tab-' + key + '"><a href="#">' + data[key].label + '</a></li>';
                menu.append(item);
            }
        }
        
        // event listener for tab clicks
        $('#' + id +  ' ul li').click(function (id, registry) {
            // return the actual event handler so that
            // id stays inside the closure
            return function (event) {
                // make tab inactive
                $('#' + id + ' .tabs li').removeClass('active');
                // hide all content divs
                $('#' + id +  ' .content div').hide();
                
                var name = this.id.replace('tab-', '');
                
                // show content
                registry[name].show();
            };
        }(id, registry));
    }
    
// 
// Returns a base object for all widgets
// 
    function widget_base(debug) {
        var that = {};
        
        that.getId = function () {
            return 'content-' + debug.name;
        };
        
        // show content
        that.show = function () {
            // show tab as active
            $('#tab-' + debug.name).addClass('active');
            $('#' + that.getId()).show();
        };
        
        // hide content
        that.hide = function () {
            $('#' + that.getId()).hide();
        };
        
        return that;
    }

// -----------------------------------------------------------------------------
// 
// Widgets
// 

// 
// SQL Profiler
// 
    function solar_sql(debug) {
        
        // inherit from widget_base
        var that = widget_base(debug);
        
        that.render = function (el) {
            var inner,
                i,
                key;
            
            inner = '<div id="' + that.getId() + '"><table>';
            for (i = 0; i < debug.data.length; i++) {
                inner += '<tr>';
                inner += '<td class="num">' + (i + 1) + '</td>';
                inner += '<td class="time">' + debug.data[i][0] + '</td>';
                inner += '<td class="query"><pre>' + debug.data[i][1] + '</pre></td>';
                inner += '</tr>';
            }
            inner += '</table></div>';
            
            el.append(inner);
        };
        
        return that;
    };
    
// 
// Log viewer
// 
     function solar_log(debug) {
        
        var that = widget_base(debug);
        
        that.render = function (el) {
            var inner,
                i,
                line;
            
            // start inner html
            inner = '<div id="' + that.getId() + '"><table>';
            
            for (i = 0; i < debug.data.length; i++) {
                line = debug.data[i];
                inner += [
                    '<tr class="' + line.event + '">',
                    '<td class="class">' + line['class'] + '</td>',
                    '<td class="event">' + line.event + '</td>',
                    '<td class="descr">' + line.descr + '</td>',
                    '</tr>'
                ].join('');
            }
            
            // finish html and append to given element
            inner += '</table></div>';
            el.append(inner);
        };
        
        return that;
    };

// 
// Superglobals
// 
    function solar_request(debug) {
        
        var that = widget_base(debug);
        
        that.render = function (el) {
            var inner,
                key,
                val;
            
            // start inner html
            inner = '<div id="' + that.getId() + '"><table>';
            
            for (key in debug.data.server) {
                val = debug.data.server[key];
                inner += [
                    '<tr>',
                    '<td class="key">' + key + '</td>',
                    '<td class="value">' + val + '</td>',
                    '</tr>'
                ].join('');
            }
            
            // finish html and append to given element
            inner += '</table></div>';
            el.append(inner);
        };
        
        return that;
    };
    

// exposed widgets
    widgets = {
        "solar_sql"     : solar_sql,
        "solar_log"     : solar_log,
        "solar_request" : solar_request
    };
    
// 
// return public methods
// 
    return {
        "render" : render
    };
};

