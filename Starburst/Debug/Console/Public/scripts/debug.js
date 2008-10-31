/**
 * 
 * Debug console for Solar
 * 
 * @author Antti Holvikari <anttih@gmail.com>
 * 
 */
var Starburst_Debug_Console = function (data) {
    
    var id = 'starburst_debug_console',
        widgets = {};
    
    // renders wrapper HTML
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
        
        $('#' + id +  ' ul li').click(function (id) {
            // return the event handler so that
            // id stays inside the closure
            return function (event) {
                $('#' + id +  ' .content div').hide();
                var el_id = this.id.replace(/tab-/, 'content-');
                $(document.getElementById(el_id)).show();
            };
        }(id));
    }
    
    // Returns a base object for all widgets
    function widget_base(debug) {
        var that = {};
        
        that.getId = function () {
            return 'content-' + debug.name;
        };
        
        that.hide = function () {
            $('#' + that.getId()).hide();
        };
        
        return that;
    }
    
    // SQL Profiler
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
    
    // Log viewer
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
    
    // public methods
    return {
        "render" : function () {
            var key, spec, w;
            
            // render the console wrapper
            render_console();
            
            // render each widget
            for (key in widgets) {
                // class name to lowercase
                key = key.toLowerCase();
                if (widgets.hasOwnProperty(key)) {
                    // get a new widget object and render
                    w = widgets[key]({
                        'name' : key,
                        'data' : data[key].data
                    });
                    
                    // render widget passing in content div element
                    w.render($('#' + id + ' .content'));
                    w.hide();
                }
            }
        }
    };
};

