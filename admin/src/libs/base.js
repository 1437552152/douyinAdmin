exports.install = function (Vue, options) {
    Vue.prototype.mul = function mul(a, b) { // 乘法
        var c = 0,
            d = a.toString(),
            e = b.toString();
        try {
            c += d.split(".")[1].length;
        } catch (f) {}
        try {
            c += e.split(".")[1].length;
        } catch (f) {}
        return Number(d.replace(".", "")) * Number(e.replace(".", "")) / Math.pow(10, c);
    };
    Vue.prototype.div = function div(a, b) { // 除法
        var c,
            d,
            e = 0,
            f = 0;
        try {
            e = a
                .toString()
                .split(".")[1]
                .length;
        } catch (g) {}
        try {
            f = b
                .toString()
                .split(".")[1]
                .length;
        } catch (g) {}
        return c = Number(a.toString().replace(".", "")),
        d = Number(b.toString().replace(".", "")),
        this.mul(c / d, Math.pow(10, f - e));
    };
    Vue.prototype.round = function round(v, e) {
        var t = 1;
        for (; e > 0; t *= 10, e--) 
        ;
        for (; e < 0; t /= 10, e++) 
        ;
        return Math.round(v * t) / t;
    };
};