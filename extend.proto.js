//这些并没有什么含量，只是训练思维
//1,function的扩展
Function.prototype.method = function(name, fn) {

    this.prototype[name] = fn;

    return this;

};
//2,Number的扩展
//功能;正负数字的四舍五入。
Number.method('integer', function() {

    return Math[this < 0 ? 'ceil' : 'floor'](this);

});
//3,String的扩展
//功能：移除字符串前后的空白字符
String.method('trim', function() {
    return this.replace(/^\s+|\s+$/, '');
});

//4,function的扩展
//功能：柯里化-
Function.method('curry', function() {
    var slice = Array.prototype.slice;
    var args = slice.apply(arguments),
        that = this;
    return function() {
        return that.apply(null, args.concat(slice.apply(arguments)));
    };
});
//柯里化示例
var add = function() {
    var i, sum = 0,
        len = arguments.length;
    for (var i = 0; i < len; i++) {
        sum += arguments[i];
    }
    return sum;
};
var add1 = add.curry(2);
console.log(add1(3));
//5,斐波那契函数
var fibonacci = function(n) {
    return n < 2 ? n : fibonacci(n - 1) + fibonacci(n - 2);
};
for (var i = 0; i <= 10; i++) {
    console.log('i===' + fibonacci(i));
}
//6,斐波那契函数-拓展
var momozier = function(memo, formula) {
    var recur = function(n) {
        var result = memo[n];
        if (typeof result !== 'number') {
            result = formula(recur, n);
            memo[n] = result;
        }
        return result;
    };
    return recur;
};
var fabonacci = momozier([0, 1], function(recur, n) {
    return recur(n - 1) + recur(n - 2);
});
var fabonacci_1 = momosizer([1, 1], function(recur, n) {
    return n * recur(n - 1);
});

//高阶函数实现AOP(面向切面编程)
Function.prototype.before = function(beforefn) {
    var __self = this; // 保存原函数的引用
    return function() { // 返回包含了原函数和新函数的"代理"函数
        beforefn.apply(this, arguments);
        return __self.apply(this, arguments);
    };
};
Function.prototype.after = function(afterfn) {
    var __self = this;
    return function() {
        // 执行新函数,修正 this // 执行原函数

        var ret = __self.apply(this, arguments);

        afterfn.apply(this, arguments);
        return ret;
    };
};
var func = function() {
    console.log(2);
};
func = func.before(function() {
    console.log(1);
}).after(function() {
    console.log(3);
}).before(function() {
    console.log(4);
});
//console.log(func);
func(); //4,1,2,3-------解析：注意执行顺序。