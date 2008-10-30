/**
 * 
 * Debug console for Solar
 * 
 * @author Antti Holvikari <anttih@gmail.com>
 * 
 */
var Starburst_Debug_Report = function (data) {
    
    var id = 'starburst_debug_report',
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
        
        for (key in data) {
            if (data.hasOwnProperty(key)) {
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
    function widget_base(spec) {
        var name = spec.name,
            data = spec.data,
            that = {};
        
        that.getId = function () {
            return 'content-' + name;
        };
        
        that.hide = function () {
            $('#' + that.getId()).hide();
        };
        
        return that;
    }
    
    // SQL Profiler
    widgets.solar_sql = function (spec) {
        
        // inherit from widget_base
        var that = widget_base(spec);
        
        that.render = function (el) {
            var inner,
                i,
                key;
            
            inner = '<div id="' + that.getId() + '"><table>';
            for (i = 0; i < data.length; i++) {
                inner += '<tr><td><pre>' + data[i][1] + '</pre></td></tr>';
            }
            inner += '</table></div>';
            
            el.append(inner);
        };
        
        return that;
    };
    
    // Log viewer
    widgets.solar_log = function (spec) {
        
        var that = widget_base(spec);
        
        that.render = function (el) {
            var inner,
                i;
            
            // start inner html
            inner = '<div id="' + that.getId() + '"><table>';
            
            for (i = 0; i < data.length; i++) {
                inner += [
                    '<tr>',
                    '<td>' + data[i]['class'] + '</td>',
                    '<td>' + data[i].event + '</td>',
                    '<td>' + data[i].descr + '</td>',
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
            for (key in data) {
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

