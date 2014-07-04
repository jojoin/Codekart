/*
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
    C.ajax.get = function(url,get,callback){
        C.ajax.send({
            url: url,
            type:'GET',
            data:get,
            error:function(err,data){
                callback(err,null);
            },
            success:function(data){
                callback(null,data);
            }
        });
    };
    C.ajax.post = function(url,post,callback){
        C.ajax.send({
            url: url,
            type:'POST',
            data:post,
            error:function(xhr,err){
                callback(err,null);
            },
            success:function(data){
                callback(null,data);
            }
        });
    };

})();