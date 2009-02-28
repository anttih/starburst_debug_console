// 
// Debug console for Solar
// 
// @author Antti Holvikari <anttih@gmail.com>
// 
var Starburst_Debug_Console = function (data) {
    
    var _console = jQuery("#starburst_debug_console"); // id of this console
    
    function main() {
        var tabs;
        
        jQuery("#starburst_debug_console-open a").click(function () {
            jQuery("#starburst_debug_console-open").hide();
            _console.show();
            
            return false;
        });
        
        _console.find(".close").click(function () {
            _console.hide();
            jQuery("#starburst_debug_console-open").show();
            
            return false;
        });
        
        tabs = _console.find(".tabs");
        
        tabs.find("a.sql").click(showSub("#starburst_debug_console-sql"));
        tabs.find("a.log").click(showSub("#starburst_debug_console-log"));
        tabs.find("a.request").click(showSub("#starburst_debug_console-request"));
        
        render_sql();
        render_log();
        render_request();
        
        _console.find("#starburst_debug_console-sql").show();
    }
    
    function showSub(id) {
        return function () {
            _console.find(".sub").hide();
            _console.find(id).show();
            return false;
        };
    }
    
    function render_sql() {
        var table = _console.find("#starburst_debug_console-sql table"),
            row = table.find("tr.domtpl");
        
        jQuery.each(data.solar_sql, function (i, val) {
            var clone = row.domtpl({
                ".num/text"       : i + 1,
                ".time/text"      : val["time"],
                ".query pre/text" : val["stmt"]
            });
            
            table.append(clone);
        });
    }
    
    function render_log() {
        var table = _console.find("#starburst_debug_console-log table"),
            row = table.find("tr.domtpl");
        
        jQuery.each(data.solar_log, function (i, val) {
            var clone = row.domtpl({
                ".class/text" : val["class"],
                ".event/text" : val["event"],
                ".descr/text" : val["descr"]
            });
            
            clone.addClass(val["event"]);
            table.append(clone);
        });
    }
    
    function render_request() {
        var table = _console.find("#starburst_debug_console-request table"),
            row = table.find("tr.domtpl");
        
        jQuery.each(data.solar_request.server, function (key, val) {
            var clone;
            
            clone = row.domtpl({
                ".key/text"   : key,
                ".value/text" : val,
            });
            
            table.append(clone);
        });
    }
    
    // display the console
    main();
};

