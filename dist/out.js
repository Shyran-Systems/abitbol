! function(a) {
    if ("object" == typeof exports && "undefined" != typeof module) module.exports = a();
    else if ("function" == typeof define && define.amd) define([], a);
    else {
        var b;
        b = "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : this, b.Class = a()
    }
}(function() {
    return function a(b, c, d) {
        function e(g, h) {
            if (!c[g]) {
                if (!b[g]) {
                    var i = "function" == typeof require && require;
                    if (!h && i) return i(g, !0);
                    if (f) return f(g, !0);
                    var j = new Error("Cannot find module '" + g + "'");
                    throw j.code = "MODULE_NOT_FOUND", j
                }
                var k = c[g] = {
                    exports: {}
                };
                b[g][0].call(k.exports, function(a) {
                    var c = b[g][1][a];
                    return e(c ? c : a)
                }, k, k.exports, a, b, c, d)
            }
            return c[g].exports
        }
        for (var f = "function" == typeof require && require, g = 0; g < d.length; g++) e(d[g]);
        return e
    }({
        1: [function(a, b, c) {
            "use strict";

            function d(a) {
                e = !0;
                var b = new a;
                return e = !1, b
            }
            var e = !1,
                f = function() {};
            f.$class = f, f.$extend = function(a) {
                var b = this,
                    c = function() {
                        return e ? void 0 : (this.__init__ && this.__init__.apply(this, arguments), this.$class = c, this)
                    };
                c.prototype = d(this.$class), a = a || {};
                var g, h;
                if (a.__include__)
                    for (h = a.__include__.length - 1; h >= 0; h--)
                        for (g in a.__include__[h]) void 0 === a[g] && (a[g] = a.__include__[h][g]);
                for (g in a || {}) "__include__" != g && "__classvars__" != g && ("function" == typeof a[g] ? c.prototype[g] = function(a, c) {
                    return function() {
                        this.$super = b.prototype[a], this.$name = a;
                        try {
                            return c.apply(this, arguments)
                        } finally {
                            delete this.$super, delete this.$name
                        }
                    }
                }(g, a[g]) : c.prototype[g] = a[g]);
                var i = Object.getOwnPropertyNames(b);
                for (i = i.filter(function(a) {
                        return -1 == ["caller", "callee", "arguments"].indexOf(a)
                    }), h = 0; h < i.length; h++) void 0 === c[i[h]] && (c[i[h]] = b[i[h]]);
                if (a.__classvars__)
                    for (g in a.__classvars__) c[g] = a.__classvars__[g];
                return c.$class = c, c.$extend = f.$extend, c
            }, b.exports = f
        }, {}]
    }, {}, [1])(1)
});