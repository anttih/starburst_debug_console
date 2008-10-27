/**
 * 
 * Debug console for Solar
 * 
 * @author Antti Holvikari <anttih@gmail.com>
 * 
 */
var Starburst_Debug_Report = function (data) {
    
    var widgets = {},
    
    // renders wrapper HTML
        render_console = function () {
            var item,
                key,
                menu,
                html;
            
            html  = [
                '<div id="Starburst_Debug_Report">',
                '<ul class="tabs"></ul>',
                '<div class="content"></div>',
                '</div>'
            ].join('');
            
            $(document.body).append(html);
            
            menu = $("#Starburst_Debug_Report ul");
            
            for (key in data) {
                if (data.hasOwnProperty(key)) {
                    item = '<li id="tab-' + key + '"><a href="#">' + data[key].label + '</a></li>';
                    menu.append(item);
                }
            }
            
            $('#Starburst_Debug_Report ul li').click(function (event) {
                $('#Starburst_Debug_Report .content div').hide();
                var id = this.id.replace(/tab-/, 'content-');
                $(document.getElementById(id)).show();
            });
        },
    
    // Returns a base object for all widgets
        widget_base = function (spec) {
            var id,
                name = spec.name,
                data = spec.data;
            
            id = 'content-' + name;
            
            return that;
        };
    
    // SQL Profiler
    widgets.solar_sql = function (spec) {
        
        // inherit from widget_base
        var that = widget_base(spec);
        
        that.render = function (el) {
            var inner,
                i,
                key;
            
            inner = '<div id="' + id + '"><table>';
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
            inner = '<div id="' + id + '"><table>';
            
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
            var key, spec;
            
            // render the console wrapper
            render_console();
            
            // render each widget
            for (key in data) {
                if (widgets.hasOwnProperty(key)) {
                    // class name to lowercase
                    key = key.toLowerCase();
                    
                    // get a new widget object and render
                    widgets.key({
                        'name' : key,
                        'data' : data.key.data
                    }).render(
                        $('#Starburst_Debug_Report .content')
                    );
                }
            }
        }
    };
};

