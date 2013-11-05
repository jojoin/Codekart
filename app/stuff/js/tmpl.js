/**
 * 微型模板引擎 tmpl 0.2
 *
 * 0.2 更新:
 * 1. 修复转义字符与id判断的BUG
 * 2. 放弃低效的 with 语句从而最高提升3.5倍的执行效率
 * 3. 使用随机内部变量防止与模板变量产生冲突
 *
 * @author	John Resig, Tang Bin
 * @see		http://ejohn.org/blog/javascript-micro-templating/
 * @name	tmpl
 * @param	{String}	模板内容或者装有模板内容的元素ID
 * @param	{Object}	附加的数据
 * @return	{String}	解析好的模板
 *
 * @example
 * 方式一：在页面嵌入模板
 * <script type="text/tmpl" id="tmpl-demo">
 * <ol title="<%=name%>">
 * 	<% for (var i = 0, l = list.length; i < length; i ++) { %>
 * 		<li><%=list[i]%></li>
 * 	<% } %>
 * </ol>
 * </script>
 * tmpl('tmpl-demo', {name: 'demo data', list: [202, 96, 133, 134]})
 *
 * 方式二：直接传入模板：
 * var demoTmpl =
 * '<ol title="<%=name%>">'
 * + '<% for (var i = 0, l = list.length; i < length; i ++) { %>'
 * +	'<li><%=list[i]%></li>'
 * + '<% } %>'
 * +'</ol>';
 * var render = tmpl(demoTmpl);
 * render({name: 'demo data', list: [202, 96, 133, 134]});
 *
 * 这两种方式区别在于第一个会自动缓存编译好的模板，
 * 而第二种缓存交给外部对象控制，如例二中的 render 变量。
 */

window.tmpl = (function (cache, $) {
    return function (str, data) {
        var fn = !/\s/.test(str)
            ? cache[str] = cache[str]
            || tmpl(document.getElementById(str).innerHTML)

            : function (data) {
            var i, variable = [$], value = [[]];
            for (i in data) {
                variable.push(i);
                value.push(data[i]);
            };
            return (new Function(variable, fn.$))
                .apply(data, value).join("");
        };

        fn.$ = fn.$ || $ + ".push('"
            + str.replace(/\\/g, "\\\\")
            .replace(/[\r\t\n]/g, " ")
            .split("[%").join("\t")
            .replace(/((^|%])[^\t]*)'/g, "$1\r")
            .replace(/\t=(.*?)%]/g, "',$1,'")
            .split("\t").join("');")
            .split("%]").join($ + ".push('")
            .split("\r").join("\\'")
            + "');return " + $;

        return data ? fn(data) : fn;
    }})({}, '$' + (+ new Date));
