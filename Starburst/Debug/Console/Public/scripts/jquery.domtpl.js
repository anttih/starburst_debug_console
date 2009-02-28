//
// Simple DOM templating plugin for jQuery
// 
// Uses existing DOM elements as templates. You select
// a node and call `.template(data)` on it. Data you pass
// in should be an object with keys of the format:
// 
//     `<selector>/func(<params>)`.
// 
// Example:
// 
//     <div id="comments">
//         <div id="tpl" class="comment">
//             <img src="http://example.com"/>
//             <a class="homepage" href="#"></a>
//             <div class="body"></div>
//         </div>
//     </div>
//     
//     var new_comment = jQuery("#tpl").domtpl({
//         ".homepage/attr(href)" : "http://example.com",
//         ".homepage/text"       : "Homepage",
//         ".body/html"           : "<p>Comment body</p>",
//         "img/attr(src)"        : "http://example.com/images/profileimg.jpg"
//     });
//     
//     jQuery.append(new_comment);
// 
// Author: Antti Holvikari <anttih@gmail.com>
// 

jQuery.fn.domtpl = function (data) {
    // first clone the template node
    var cloned = this.clone();
    
    jQuery.each(data, function (key, val) {
        var parts,
            el,
            reg = /^(.+)\/([\w]+)(?:\((\w+)\))?$/,
            selector,
            func,
            args;
        
        parts = reg.exec(key);
        
        // split in parts
        selector = parts[1];
        func     = parts[2];
        args     = parts[3];
        
        // find the element we want to modify
        el = cloned.find(selector);
        
        if (! (func in el)) {
            throw {
                name    : "TypeError",
                message : "Function not found"
            }
        }
        
        if (args !== undefined) {
            args = args.split(",");
            
            // add the actual value to params
            args.push(val);
        } else {
            args = [val];
        }
        
        // get the function object and call it
        func = el[func];
        func.apply(el, args);
    });
    
    if (cloned.hasClass("domtpl")) {
        cloned.removeClass("domtpl");
    }
    
    return cloned;
};