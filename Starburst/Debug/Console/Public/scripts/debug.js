/**
 * Debug console for Solar
 * 
 * @author Antti Holvikari <anttih@gmail.com>
 */
var Starburst_Debug_Console = function (data) {
        // id of this console
    var id = 'starburst_debug_console',
        
        // default tab
        d = 'solar_log',
        
        // list of widgets so that we can iterate over them
        widgets = {},
        
        // registry of widgets
        registry = {};
    
    /**
     * Renders wrapper HTML
     */
    function render_console() {
        var item,
            key,
            menu,
            html;
        
        html  = [
            '<div id="' + id + '">',
            '<ul class="tabs"></ul>',
            '<div class="content"></div>',
            '</div>'
        ].join('');
        
        $(document.body).append(html);
        
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
    
    /**
     * Returns a base object for all widgets
     */
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
            if (debug.name !== d) {
                $('#' + that.getId()).hide();
            }
        };
        
        return that;
    }
    
    /**
     * SQL Profiler
     */
    widgets.solar_sql = function (debug) {
        
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
    
    /**
     * Log viewer
     */
    widgets.solar_log = function (debug) {
        
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

    /**
     * Superglobals
     */
    widgets.solar_request = function (debug) {
        
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
    
    // public methods
    return {
        
        /**
         * Renders the whole widget and all it's components
         */
        render : function () {
            var key, spec, w;
            
            // render the console wrapper
            render_console();
            
            // render each widget
            for (key in data) {
                // class name to lowercase
                key = key.toLowerCase();
                if (data.hasOwnProperty(key)) {
                    // get a new widget object and render
                    w = widgets[key]({
                        'name' : key,
                        'data' : data[key].data
                    });
                    
                    // render widget passing in content div element
                    w.render($('#' + id + ' .content'));
                    w.hide();
                    
                    // add to registry
                    registry[key] = w;
                }
            }
        }
    };
};

