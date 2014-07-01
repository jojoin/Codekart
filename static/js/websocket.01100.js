window.Tpls={};
//初始化 域名空间 大写的字母 C
window.C = window.C || {};
//C.websocket_polling_url_base = [#=websocket_polling_url_base#];




/*
 json2.js
 2014-02-04

 Public Domain.

 NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.

 See http://www.JSON.org/js.html


 This code should be minified before deployment.
 See http://javascript.crockford.com/jsmin.html

 USE YOUR OWN COPY. IT IS EXTREMELY UNWISE TO LOAD CODE FROM SERVERS YOU DO
 NOT CONTROL.


 This file creates a global JSON object containing two methods: stringify
 and parse.

 JSON.stringify(value, replacer, space)
 value       any JavaScript value, usually an object or array.

 replacer    an optional parameter that determines how object
 values are stringified for objects. It can be a
 function or an array of strings.

 space       an optional parameter that specifies the indentation
 of nested structures. If it is omitted, the text will
 be packed without extra whitespace. If it is a number,
 it will specify the number of spaces to indent at each
 level. If it is a string (such as '\t' or '&nbsp;'),
 it contains the characters used to indent at each level.

 This method produces a JSON text from a JavaScript value.

 When an object value is found, if the object contains a toJSON
 method, its toJSON method will be called and the result will be
 stringified. A toJSON method does not serialize: it returns the
 value represented by the name/value pair that should be serialized,
 or undefined if nothing should be serialized. The toJSON method
 will be passed the key associated with the value, and this will be
 bound to the value

 For example, this would serialize Dates as ISO strings.

 Date.prototype.toJSON = function (key) {
 function f(n) {
 // Format integers to have at least two digits.
 return n < 10 ? '0' + n : n;
 }

 return this.getUTCFullYear()   + '-' +
 f(this.getUTCMonth() + 1) + '-' +
 f(this.getUTCDate())      + 'T' +
 f(this.getUTCHours())     + ':' +
 f(this.getUTCMinutes())   + ':' +
 f(this.getUTCSeconds())   + 'Z';
 };

 You can provide an optional replacer method. It will be passed the
 key and value of each member, with this bound to the containing
 object. The value that is returned from your method will be
 serialized. If your method returns undefined, then the member will
 be excluded from the serialization.

 If the replacer parameter is an array of strings, then it will be
 used to select the members to be serialized. It filters the results
 such that only members with keys listed in the replacer array are
 stringified.

 Values that do not have JSON representations, such as undefined or
 functions, will not be serialized. Such values in objects will be
 dropped; in arrays they will be replaced with null. You can use
 a replacer function to replace those with JSON values.
 JSON.stringify(undefined) returns undefined.

 The optional space parameter produces a stringification of the
 value that is filled with line breaks and indentation to make it
 easier to read.

 If the space parameter is a non-empty string, then that string will
 be used for indentation. If the space parameter is a number, then
 the indentation will be that many spaces.

 Example:

 text = JSON.stringify(['e', {pluribus: 'unum'}]);
 // text is '["e",{"pluribus":"unum"}]'


 text = JSON.stringify(['e', {pluribus: 'unum'}], null, '\t');
 // text is '[\n\t"e",\n\t{\n\t\t"pluribus": "unum"\n\t}\n]'

 text = JSON.stringify([new Date()], function (key, value) {
 return this[key] instanceof Date ?
 'Date(' + this[key] + ')' : value;
 });
 // text is '["Date(---current time---)"]'


 JSON.parse(text, reviver)
 This method parses a JSON text to produce an object or array.
 It can throw a SyntaxError exception.

 The optional reviver parameter is a function that can filter and
 transform the results. It receives each of the keys and values,
 and its return value is used instead of the original value.
 If it returns what it received, then the structure is not modified.
 If it returns undefined then the member is deleted.

 Example:

 // Parse the text. Values that look like ISO date strings will
 // be converted to Date objects.

 myData = JSON.parse(text, function (key, value) {
 var a;
 if (typeof value === 'string') {
 a =
 /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);
 if (a) {
 return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4],
 +a[5], +a[6]));
 }
 }
 return value;
 });

 myData = JSON.parse('["Date(09/09/2001)"]', function (key, value) {
 var d;
 if (typeof value === 'string' &&
 value.slice(0, 5) === 'Date(' &&
 value.slice(-1) === ')') {
 d = new Date(value.slice(5, -1));
 if (d) {
 return d;
 }
 }
 return value;
 });


 This is a reference implementation. You are free to copy, modify, or
 redistribute.
 */

/*jslint evil: true, regexp: true */

/*members "", "\b", "\t", "\n", "\f", "\r", "\"", JSON, "\\", apply,
 call, charCodeAt, getUTCDate, getUTCFullYear, getUTCHours,
 getUTCMinutes, getUTCMonth, getUTCSeconds, hasOwnProperty, join,
 lastIndex, length, parse, prototype, push, replace, slice, stringify,
 test, toJSON, toString, valueOf
 */


// Create a JSON object only if one does not already exist. We create the
// methods in a closure to avoid creating global variables.

if (typeof JSON !== 'object') {
    JSON = {};
}

(function () {
    'use strict';

    function f(n) {
        // Format integers to have at least two digits.
        return n < 10 ? '0' + n : n;
    }

    if (typeof Date.prototype.toJSON !== 'function') {

        Date.prototype.toJSON = function () {

            return isFinite(this.valueOf())
                ? this.getUTCFullYear()     + '-' +
                f(this.getUTCMonth() + 1) + '-' +
                f(this.getUTCDate())      + 'T' +
                f(this.getUTCHours())     + ':' +
                f(this.getUTCMinutes())   + ':' +
                f(this.getUTCSeconds())   + 'Z'
                : null;
        };

        String.prototype.toJSON      =
            Number.prototype.toJSON  =
                Boolean.prototype.toJSON = function () {
                    return this.valueOf();
                };
    }

    var cx,
        escapable,
        gap,
        indent,
        meta,
        rep;


    function quote(string) {

// If the string contains no control characters, no quote characters, and no
// backslash characters, then we can safely slap some quotes around it.
// Otherwise we must also replace the offending characters with safe escape
// sequences.

        escapable.lastIndex = 0;
        return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
            var c = meta[a];
            return typeof c === 'string'
                ? c
                : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
        }) + '"' : '"' + string + '"';
    }


    function str(key, holder) {

// Produce a string from holder[key].

        var i,          // The loop counter.
            k,          // The member key.
            v,          // The member value.
            length,
            mind = gap,
            partial,
            value = holder[key];

// If the value has a toJSON method, call it to obtain a replacement value.

        if (value && typeof value === 'object' &&
            typeof value.toJSON === 'function') {
            value = value.toJSON(key);
        }

// If we were called with a replacer function, then call the replacer to
// obtain a replacement value.

        if (typeof rep === 'function') {
            value = rep.call(holder, key, value);
        }

// What happens next depends on the value's type.

        switch (typeof value) {
            case 'string':
                return quote(value);

            case 'number':

// JSON numbers must be finite. Encode non-finite numbers as null.

                return isFinite(value) ? String(value) : 'null';

            case 'boolean':
            case 'null':

// If the value is a boolean or null, convert it to a string. Note:
// typeof null does not produce 'null'. The case is included here in
// the remote chance that this gets fixed someday.

                return String(value);

// If the type is 'object', we might be dealing with an object or an array or
// null.

            case 'object':

// Due to a specification blunder in ECMAScript, typeof null is 'object',
// so watch out for that case.

                if (!value) {
                    return 'null';
                }

// Make an array to hold the partial results of stringifying this object value.

                gap += indent;
                partial = [];

// Is the value an array?

                if (Object.prototype.toString.apply(value) === '[object Array]') {

// The value is an array. Stringify every element. Use null as a placeholder
// for non-JSON values.

                    length = value.length;
                    for (i = 0; i < length; i += 1) {
                        partial[i] = str(i, value) || 'null';
                    }

// Join all of the elements together, separated with commas, and wrap them in
// brackets.

                    v = partial.length === 0
                        ? '[]'
                        : gap
                        ? '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']'
                        : '[' + partial.join(',') + ']';
                    gap = mind;
                    return v;
                }

// If the replacer is an array, use it to select the members to be stringified.

                if (rep && typeof rep === 'object') {
                    length = rep.length;
                    for (i = 0; i < length; i += 1) {
                        if (typeof rep[i] === 'string') {
                            k = rep[i];
                            v = str(k, value);
                            if (v) {
                                partial.push(quote(k) + (gap ? ': ' : ':') + v);
                            }
                        }
                    }
                } else {

// Otherwise, iterate through all of the keys in the object.

                    for (k in value) {
                        if (Object.prototype.hasOwnProperty.call(value, k)) {
                            v = str(k, value);
                            if (v) {
                                partial.push(quote(k) + (gap ? ': ' : ':') + v);
                            }
                        }
                    }
                }

// Join all of the member texts together, separated with commas,
// and wrap them in braces.

                v = partial.length === 0
                    ? '{}'
                    : gap
                    ? '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}'
                    : '{' + partial.join(',') + '}';
                gap = mind;
                return v;
        }
    }

// If the JSON object does not yet have a stringify method, give it one.

    if (typeof JSON.stringify !== 'function') {
        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
        meta = {    // table of character substitutions
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"' : '\\"',
            '\\': '\\\\'
        };
        JSON.stringify = function (value, replacer, space) {

// The stringify method takes a value and an optional replacer, and an optional
// space parameter, and returns a JSON text. The replacer can be a function
// that can replace values, or an array of strings that will select the keys.
// A default replacer method can be provided. Use of the space parameter can
// produce text that is more easily readable.

            var i;
            gap = '';
            indent = '';

// If the space parameter is a number, make an indent string containing that
// many spaces.

            if (typeof space === 'number') {
                for (i = 0; i < space; i += 1) {
                    indent += ' ';
                }

// If the space parameter is a string, it will be used as the indent string.

            } else if (typeof space === 'string') {
                indent = space;
            }

// If there is a replacer, it must be a function or an array.
// Otherwise, throw an error.

            rep = replacer;
            if (replacer && typeof replacer !== 'function' &&
                (typeof replacer !== 'object' ||
                    typeof replacer.length !== 'number')) {
                throw new Error('JSON.stringify');
            }

// Make a fake root object containing our value under the key of ''.
// Return the result of stringifying the value.

            return str('', {'': value});
        };
    }


// If the JSON object does not yet have a parse method, give it one.

    if (typeof JSON.parse !== 'function') {
        cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
        JSON.parse = function (text, reviver) {

// The parse method takes a text and an optional reviver function, and returns
// a JavaScript value if the text is a valid JSON text.

            var j;

            function walk(holder, key) {

// The walk method is used to recursively walk the resulting structure so
// that modifications can be made.

                var k, v, value = holder[key];
                if (value && typeof value === 'object') {
                    for (k in value) {
                        if (Object.prototype.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v;
                            } else {
                                delete value[k];
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value);
            }


// Parsing happens in four stages. In the first stage, we replace certain
// Unicode characters with escape sequences. JavaScript handles many characters
// incorrectly, either silently deleting them, or treating them as line endings.

            text = String(text);
            cx.lastIndex = 0;
            if (cx.test(text)) {
                text = text.replace(cx, function (a) {
                    return '\\u' +
                        ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                });
            }

// In the second stage, we run the text against regular expressions that look
// for non-JSON patterns. We are especially concerned with '()' and 'new'
// because they can cause invocation, and '=' because it can cause mutation.
// But just to be safe, we want to reject all unexpected forms.

// We split the second stage into 4 regexp operations in order to work around
// crippling inefficiencies in IE's and Safari's regexp engines. First we
// replace the JSON backslash pairs with '@' (a non-JSON character). Second, we
// replace all simple value tokens with ']' characters. Third, we delete all
// open brackets that follow a colon or comma or that begin the text. Finally,
// we look to see that the remaining characters are only whitespace or ']' or
// ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.

            if (/^[\],:{}\s]*$/
                .test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')
                    .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
                    .replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

// In the third stage we use the eval function to compile the text into a
// JavaScript structure. The '{' operator is subject to a syntactic ambiguity
// in JavaScript: it can begin a block or an object literal. We wrap the text
// in parens to eliminate the ambiguity.

                j = eval('(' + text + ')');

// In the optional fourth stage, we recursively walk the new structure, passing
// each name/value pair to a reviver function for possible transformation.

                return typeof reviver === 'function'
                    ? walk({'': j}, '')
                    : j;
            }

// If the text is not JSON parseable, then a SyntaxError is thrown.

            throw new SyntaxError('JSON.parse');
        };
    }
}());

/**
 * Codekart 接口
 */
C.json = JSON;/*
 * Class: Ajax
 * Author: Bachue Zhou
 * Description: Deliver Ajax module from jquery
 * Date: 12/08/2010
 * Depend on: JSON.parse() Must be provided!
 * Version: 0.02
 */

(function() {


    var Ajax;

    if (!Ajax || typeof(Ajax) != "object") {
        Ajax = {};
    }
    Ajax.ajaxSettings = { //init ajax setting
        url: location.href,
        type: "GET",
        contentType: "application/x-www-form-urlencoded",
        processData: true,
        async: true,
        /*
         timeout: 0,
         data: null,
         username: null,
         password: null,
         traditional: false,
         */
        xhr: function () {
            //return ajax object. must be comparable with fuck ie.
            try {
                return new XMLHttpRequest();
            } catch (e) {
                try {
                    return new ActiveXObject("Msxml2.XMLHTTP");
                } catch (e) {
                    return new ActiveXObject("Microsoft.XMLHTTP");
                }
            }
        },
        accepts: {
            xml: "application/xml, text/xml",
            html: "text/html",
            script: "text/javascript, application/javascript",
            json: "application/json, text/javascript",
            text: "text/plain",
            _default: "*/*"
        }
    };
    Ajax.setup = function (settings) {
        Ajax._extend(Ajax.ajaxSettings, settings);
    };
    Ajax.send = function (origSettings) {
        function getType(obj) {
            return obj === null ? String(obj) : class2type[toString.call(obj)] || "object";
        }

        function isFunction(obj) {
            return getType(obj) === "function";
        }

        function isArray(obj) {
            return getType(obj) === "array";
        }

        function isEmptyObject(obj) {
            for (var name in obj) {
                return false;
            }
            return true;
        }

        function param(a) {
            var s = [],
                name, add = function (key, value) {
                    // If value is a function, invoke it and return its value
                    value = isFunction(value) ? value() : value;
                    s[s.length] = encodeURIComponent(key) + "=" + encodeURIComponent(value);
                };
            // If an array was passed in, assume that it is an array of form elements.
            if (isArray(a)) {
                // Serialize the form elements
                for (name in a) {
                    add(name, a[name]);
                }
            } else {
                // If traditional, encode the "old" way (the way 1.3.2 or older
                // did it), otherwise encode params recursively.
                for (var prefix in a) {
                    buildParams(prefix, a[prefix], add);
                }
            }
            // Return the resulting serialization
            return s.join("&").replace(r20, "+");
        }

        function buildParams(prefix, obj, add) {
            if (isArray(obj) && obj.length) {
                // Serialize array item.
                for (var i in obj) {
                    var v = obj[i];
                    if (rbracket.test(prefix)) {
                        // Treat each array item as a scalar.
                        add(prefix, v);
                    } else {
                        // If array item is non-scalar (array or object), encode its
                        // numeric index to resolve deserialization ambiguity issues.
                        // Note that rack (as of 1.0.0) can't currently deserialize
                        // nested arrays properly, and attempting to do so may cause
                        // a server error. Possible fixes are to modify rack's
                        // deserialization algorithm or to provide an option or flag
                        // to force array serialization to be shallow.
                        buildParams(prefix + "[" + (typeof v === "object" || isArray(v) ? i : "") + "]", v, add);
                    }
                }
            } else if (obj !== null && typeof(obj) === "object") {
                if (isEmptyObject(obj)) {
                    add(prefix, "");
                } else {
                    // Serialize object item.
                    for (var k in obj) {
                        var v = obj[k];
                        buildParams(prefix + "[" + k + "]", v, add);
                    }
                }
            } else {
                // Serialize scalar item.
                add(prefix, obj);
            }
        }

        function globalEval(data) {
            if (data && rnotwhite.test(data)) {
                // Inspired by code by Andrea Giammarchi
                // http://webreflection.blogspot.com/2007/08/global-scope-evaluation-and-dom.html
                var head = document.getElementsByTagName("head")[0] || document.documentElement,
                    script = document.createElement("script");
                script.type = "text/javascript";
                if (scriptEval) {
                    script.appendChild(document.createTextNode(data));
                } else {
                    script.text = data;
                }
                // Use insertBefore instead of appendChild to circumvent an IE6 bug.
                // This arises when a base node is used (#2709).
                head.insertBefore(script, head.firstChild);
                head.removeChild(script);
            }
        }

        //return current time
        function now() {
            return (new Date()).getTime();
        }

        function handleError(s, xhr, status, e) {
            // If a local callback was specified, fire it
            if (s.error) {
                s.error.call(s.context, xhr, status, e);
            }
        }

        function handleSuccess(s, xhr, status, data) {
            // If a local callback was specified, fire it and pass it the data
            if (s.success) {
                s.success.call(s.context, data, status, xhr);
            }
        }

        function handleComplete(s, xhr, status) {
            // Process result
            if (s.complete) {
                s.complete.call(s.context, xhr, status);
            }
        }

        // Determines if an XMLHttpRequest was successful or not
        function httpSuccess(xhr) {
            try {
                // IE error sometimes returns 1223 when it should be 204 so treat it as success, see #1450
                return !xhr.status && location.protocol === "file:" || xhr.status >= 200 && xhr.status < 300 || xhr.status === 304 || xhr.status === 1223;
            } catch (e) {
            }
            return false;
        }

        // Determines if an XMLHttpRequest returns NotModified
        function httpNotModified(xhr, url) {
            var lastModified = xhr.getResponseHeader("Last-Modified"),
                etag = xhr.getResponseHeader("Etag");
            if (lastModified) {
                lastModified[url] = lastModified;
            }
            if (etag) {
                etag[url] = etag;
            }
            return xhr.status === 304;
        }

        function httpData(xhr, type, s) {
            var ct = xhr.getResponseHeader("content-type") || "",
                xml = type === "xml" || !type && ct.indexOf("xml") >= 0,
                data = xml ? xhr.responseXML : xhr.responseText;
            if (xml && data.documentElement.nodeName === "parsererror") {
                throw "parsererror";
            }
            // Allow a pre-filtering function to sanitize the response
            // s is checked to keep backwards compatibility
            if (s && s.dataFilter) {
                data = s.dataFilter(data, type);
            }
            // The filter can actually parse the response
            if (typeof data === "string") {
                // Get the JavaScript object, if JSON is used.
                if (type === "json" || !type && ct.indexOf("json") >= 0) {
                    data = JSON.parse(data);
                } else if (type === "script" || !type && ct.indexOf("javascript") >= 0) {
                    globalEval(data);
                }
            }
            return data;
        }

        function noop() {
        }

        var root = document.documentElement,
            script = document.createElement("script"),
            id = "script" + now(),
            scriptEval = false;
        script.type = "text/javascript";
        try {
            script.appendChild(document.createTextNode("window." + id + "=1;"));
        } catch (e) {
        }
        root.insertBefore(script, root.firstChild);
        // Make sure that the execution of code works by injecting a script
        // tag with appendChild/createTextNode
        // (IE doesn't support this, fails, and uses .text instead)
        if (window[id]) {
            scriptEval = true;
            delete window[id];
        }
        root.removeChild(script);
        var class2type = {
                "[object Array]": "array",
                "[object Boolean]": "boolean",
                "[object Date]": "date",
                "[object Function]": "function",
                "[object Number]": "number",
                "[object Object]": "object",
                "[object RegExp]": "regexp",
                "[object String]": "string"
            },
            jsc = now(),
            rscript = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
            rselectTextarea = /^(?:select|textarea)/i,
            rinput = /^(?:color|date|datetime|email|hidden|month|number|password|range|search|tel|text|time|url|week)$/i,
            rnoContent = /^(?:GET|HEAD)$/,
            rbracket = /\[\]$/,
            jsre = /\=\?(&|$)/,
            rquery = /\?/,
            rts = /([?&])_=[^&]*/,
            rurl = /^(\w+:)?\/\/([^\/?#]+)/,
            r20 = /%20/g,
            rhash = /#.*$/,
            rnotwhite = /\S/,
            lastModified = {},
            etag = {},
            s = Ajax._extend(Ajax.ajaxSettings, origSettings),
            jsonp, status, data, type = s.type.toUpperCase(),
            noContent = rnoContent.test(type);
        //erase some meaningless symbol
        s.url = s.url.replace(rhash, "");
        // Use original (not extended) context object if it was provided
        s.context = origSettings && origSettings.context !== null ? origSettings.context : s;
        // convert data if not already a string
        if (s.data && s.processData && typeof s.data !== "string") {
            s.data = param(s.data);
        }
        if (s.dataType === "jsonp") {
            if (type === "GET") {
                //test whether there is '=?' in URL, if not, splice it
                if (!jsre.test(s.url)) {
                    s.url += (rquery.test(s.url) ? "&" : "?") + (s.jsonp || "callback") + "=?";
                }
            }
            //test data
            else if (!s.data || !jsre.test(s.data)) {
                s.data = (s.data ? s.data + "&" : "") + (s.jsonp || "callback") + "=?";
            }
            //set datatype to json
            s.dataType = "json";
        }
        if (s.dataType === "json" && (s.data && jsre.test(s.data) || jsre.test(s.url))) {
            jsonp = s.jsonpCallback || ("jsonp" + jsc++);
            // Replace the =? sequence both in the query string and the data
            if (s.data) {
                s.data = (s.data + "").replace(jsre, "=" + jsonp + "$1");
            }
            s.url = s.url.replace(jsre, "=" + jsonp + "$1");
            // We need to make sure
            // that a JSONP style response is executed properly
            s.dataType = "script";
            // Handle JSONP-style loading
            var customJsonp = window[jsonp];
            window[jsonp] = function (tmp) {
                if (isFunction(customJsonp)) {
                    customJsonp(tmp);
                } else {
                    // Garbage collect
                    window[jsonp] = undefined;
                    try {
                        delete window[jsonp];
                    } catch (jsonpError) {
                    }
                }
                data = tmp;
                handleSuccess(s, xhr, status, data);
                handleComplete(s, xhr, status, data);
                if (head) {
                    head.removeChild(script);
                }
            };
        }
        // If data is available, append data to url for GET/HEAD requests
        if (s.data && noContent) {
            s.url += (rquery.test(s.url) ? "&" : "?") + s.data;
        }
        // Matches an absolute URL, and saves the domain
        var parts = rurl.exec(s.url),
            remote = parts && (parts[1] && parts[1].toLowerCase() !== location.protocol || parts[2].toLowerCase() !== location.host);
        if (s.dataType === "script" && type === "GET" && remote) {
            var head = document.getElementsByTagName("head")[0] || document.documentElement;
            var script = document.createElement("script");
            if (s.scriptCharset) {
                script.charset = s.scriptCharset;
            }
            script.src = s.url;
            // Handle Script loading
            if (!jsonp) {
                var done = false;
                // Attach handlers for all browsers
                script.onload = script.onreadystatechange = function () {
                    if (!done && (!this.readyState || this.readyState === "loaded" || this.readyState === "complete")) {
                        done = true;
                        handleSuccess(s, xhr, status, data);
                        handleComplete(s, xhr, status, data);
                        // Handle memory leak in IE
                        script.onload = script.onreadystatechange = null;
                        if (head && script.parentNode) {
                            head.removeChild(script);
                        }
                    }
                };
            }
            // Use insertBefore instead of appendChild  to circumvent an IE6 bug.
            // This arises when a base node is used (#2709 and #4378).
            head.insertBefore(script, head.firstChild);
            // We handle everything using the script element injection
            return undefined;
        }
        var requestDone = false;
        // Create the request object
        var xhr = s.xhr();
        if (!xhr) {
            return;
        }
        // Open the socket
        // Passing null username, generates a login popup on Opera (#2865)
        if (s.username) {
            xhr.open(type, s.url, s.async, s.username, s.password);
        } else {
            xhr.open(type, s.url, s.async);
        }
        // Need an extra try/catch for cross domain requests in Firefox 3
        try {
            // Set content-type if data specified and content-body is valid for this type
            if ((s.data !== null && !noContent) || (origSettings && origSettings.contentType)) {
                xhr.setRequestHeader("Content-Type", s.contentType);
            }
            // Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
            if (s.ifModified) {
                if (lastModified[s.url]) {
                    xhr.setRequestHeader("If-Modified-Since", lastModified[s.url]);
                }
                if (etag[s.url]) {
                    xhr.setRequestHeader("If-None-Match", etag[s.url]);
                }
            }
            // Set header so the called script knows that it's an XMLHttpRequest
            // Only send the header if it's not a remote XHR
            if (!remote) {
                xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
            }
            // Set the Accepts header for the server, depending on the dataType
            xhr.setRequestHeader("Accept", s.dataType && s.accepts[s.dataType] ? s.accepts[s.dataType] + ", */*; q=0.01" : s.accepts._default);
        } catch (headerError) {
        }
        // Allow custom headers/mimetypes and early abort
        if (s.beforeSend && s.beforeSend.call(s.context, xhr, s) === false) {
            // close opended socket
            xhr.abort();
            return false;
        }
        var onreadystatechange = xhr.onreadystatechange = function (isTimeout) {
            // The request was aborted
            if (!xhr || xhr.readyState === 0 || isTimeout === "abort") {
                // Opera doesn't call onreadystatechange before this point
                // so we simulate the call
                if (!requestDone) {
                    handleComplete(s, xhr, status, data);
                }
                requestDone = true;
                if (xhr) {
                    xhr.onreadystatechange = noop;
                }
                // The transfer is complete and the data is available, or the request timed out
            } else if (!requestDone && xhr && (xhr.readyState === 4 || isTimeout === "timeout")) {
                requestDone = true;
                xhr.onreadystatechange = noop;
                status = isTimeout === "timeout" ? "timeout" : !httpSuccess(xhr) ? //really success?
                    "error" : s.ifModified && httpNotModified(xhr, s.url) ? "notmodified" : "success";
                var errMsg;
                if (status === "success") {
                    // Watch for, and catch, XML document parse errors
                    try {
                        // process the data (runs the xml through httpData regardless of callback)
                        data = httpData(xhr, s.dataType, s); //judge responseXML or responseText
                    } catch (parserError) {
                        status = "parsererror";
                        errMsg = parserError;
                    }
                }
                // Make sure that the request was successful or notmodified
                if (status === "success" || status === "notmodified") {
                    // JSONP handles its own success callback
                    if (!jsonp) {
                        handleSuccess(s, xhr, status, data);
                    }
                } else {
                    handleError(s, xhr, status, errMsg);
                }
                // Fire the complete handlers
                if (!jsonp) {
                    handleComplete(s, xhr, status, data);
                }
                if (isTimeout === "timeout") {
                    xhr.abort();
                }
                // Stop memory leaks
                if (s.async) {
                    xhr = null;
                }
            }
        };
        // Override the abort handler, if we can (IE 6 doesn't allow it, but that's OK)
        // Opera doesn't fire onreadystatechange at all on abort
        try {
            var oldAbort = xhr.abort;
            xhr.abort = function () {
                if (xhr) {
                    // oldAbort has no call property in IE7 so
                    // just do it this way, which works in all
                    // browsers
                    Function.prototype.call.call(oldAbort, xhr);
                }
                onreadystatechange("abort");
            };
        } catch (abortError) {
        }
        // Timeout checker
        if (s.async && s.timeout > 0) {
            setTimeout(function () {
                // Check to see if the request is still happening
                if (xhr && !requestDone) {
                    onreadystatechange("timeout");
                }
            }, s.timeout);
        }
        // Send the data
        try {
            xhr.send(noContent || s.data === null ? null : s.data);
        } catch (sendError) {
            handleError(s, xhr, null, sendError);
            // Fire the complete handlers
            handleComplete(s, xhr, status, data);
        }
        // firefox 1.5 doesn't fire statechange for sync requests
        if (!s.async) {
            onreadystatechange();
        }
        // return XMLHttpRequest to allow aborting the request etc.
        return xhr;
    };
//merge multi objects into the first object and return
    Ajax._extend = function () {
        var target = arguments[0] || {},
            i, length = arguments.length,
            options, src, copy, clone, name;
        for (i = 1; i < length; ++i) {
            // Only deal with non-null/undefined values
            if ((options = arguments[i]) !== null) {
                // Extend the base object
                for (name in options) {
                    src = target[name];
                    copy = options[name];
                    // Prevent never-ending loop
                    if (target === copy) {
                        continue;
                    }
                    // Recurse if we're merging objects
                    if (typeof(copy) == "object") {
                        clone = (src && typeof(src) == "object" ? src : {});
                        target[name] = Ajax._extend(clone, copy);
                    }
                    // Don't bring in undefined values
                    else if (copy !== undefined) {
                        target[name] = copy;
                    }
                }
            }
        }
        // Return the modified object
        return target;
    };

    C.ajax = Ajax;

})();/*
* Codekart Websocket 兼容库
* 在非原生支持 Websocket 的浏览器上 采用 http 心跳包机制
*/

C.websocket = (function(){

    /*
    系统保留的 on 消息：
    connect ：连接成功
    message ：消息到达
    error ：错误
    disconnect ：连接关闭
    reconnect ：尝试重新连接
     */

    var A = {}
        , WebSocket
        , onFunc = {}
        ;

    // 初始化socket
    A.init = function(conf){
        WebSocket = getWsObj();

    };


    // 监听处理 socket 数据
    A.on = function(path,callback){
        if(!onFunc[path]){
            onFunc[path] = [];
        }
        onFunc[path].push(callback);
    };

    // 向服务器发送 socket 数据
    A.emit = function(path,data){


    };


    // 获取 WebSocket 对象
    function getWsObj(){
        if ('WebSocket' in window) {
            return WebSocket;
        } else if ('MozWebSocket' in window) {
            return MozWebSocket;
        } else {
            return null;
        }
    }




    return A;

})();


















/*
var socket = io('ws://localhost/:92');
//alert('start');
socket.on('connect', function(){
    alert('connect!');
    socket.on('event', function(data){});
    socket.on('disconnect', function(){});
});
*/




/*
C.ajax.send({
    url: '/ajax',
    success:function(data){
        alert(data);
    }
});







var socket = new WebSocket('ws://localhost:92/asdfasgadfgadfgs'); //测试地址
// 打开Socket
socket.onopen = function(event) {

    console.log('socket onopen'+event);
    // 监听消息
    socket.onmessage = function(event){
        console.log('【websocket消息】'+event.data);
    };
    // 监听Socket的关闭，自动重启
    socket.onclose = function(event) {
        console.log('Client notified socket has closed',event);
    };

    // 发送消息
    socket.send('qewrtqwert');
};



//alert('end');




 */

