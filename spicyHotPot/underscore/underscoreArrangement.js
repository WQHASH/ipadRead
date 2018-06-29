(function () {
    //wq:数据初始化的处理 start
    var root = this;
    var previousUnderscore = root;
    var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;
    var
      push = ArrayProto.push,
      slice = ArrayProto.slice,
      toString = ObjProto.toString,
      hasOwnProperty = ObjProto.hasOwnProperty;
    var
      nativeIsArray = Array.isArray,
      nativeKeys = Object.keys, // Object.keys()方法会返回( 引用类型的键名 )一个所有元素为字符串的数组
      nativeBind = FuncProto.bind,
      nativeCreate = Object.create;
    var _ = function (obj) {
        if (obj instanceof _) return obj;
        if (!(this instanceof _)) return new _(obj);
        this._wrapped = obj;
    };
    if (typeof exports !== 'undefined') {
        if (typeof module !== 'undefined' && module.exports) {
            exports = module.exports = _;
        }
        exports._ = _;
    } else {
        root._ = _;
    };
    //wq:数据初始化的处理 end






    _.iteratee = function (value, context) {
        return cb(value, context, Infinity);
    };
    //用于 _.each 中回调函数的[优化]判断处理 => 判断了有无context[this]对象,和 argCount
    //返回一个 回调函数,用户传入的那个
    var optimizeCb = function (func, context, argCount) {
        // void 0 === "undefined"
        if (context === void 0) return func;
        switch (argCount == null ? 3 : argCount) {
            case 1: return function (value) {
                return func.call(context, value);
            };
            case 2: return function (value, other) {
                return func.call(context, value, other);
            };
            case 3: return function (value, index, collection) {
                return func.call(context, value, index, collection);
            };
            case 4: return function (accumulator, value, index, collection) {
                // obj, iteratee, memo, keys, index, length
                //obj, iteratee, memo, keys, index, length
                return func.call(context, accumulator, value, index, collection);
            };
        }
        return function () {
            return func.apply(context, arguments);
        };
    };
    var cb = function (value, context, argCount) {
        if (value == null) return _.identity;
        if (_.isFunction(value)) return optimizeCb(value, context, argCount);
        // 正常来说 value传过来的是 function
        if (_.isObject(value)) return _.matcher(value);
        return _.property(value);
    };
    var createAssigner = function (keysFunc, undefinedOnly) {
        return function (obj) {
            var length = arguments.length;
            if (length < 2 || obj == null) return obj;
            for (var index = 1; index < length; index++) {
                var source = arguments[index],
                    keys = keysFunc(source),
                    l = keys.length;
                for (var i = 0; i < l; i++) {
                    var key = keys[i];
                    if (!undefinedOnly || obj[key] === void 0) obj[key] = source[key];
                }
            }
            return obj;
        };
    };


    // pow(x, y) 方法可返回 x 的 y 次幂的值。
    var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
    var isArrayLike = function (collection) {
        var length = collection != null && collection.length;
        return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
    };
    // propertyIsEnumerable： 判断给定的属性是否可以用 for...in 语句进行枚举。
    //var hasEnumBug = !{ toString: null }.propertyIsEnumerable('toString');






    // 收藏 Functions [挂载在window下的方法]
    // ----------------
    // start
    //这里的context为可选参数
    _.each = _.forEach = function (obj, iteratee, context) {
        iteratee = optimizeCb(iteratee, context);
        var i, length;
        if (isArrayLike(obj)) {
            // 数组 || 类数组
            for (i = 0, length = obj.length; i < length; i++) {
                iteratee(obj[i], i, obj);
            }
        } else {
            // 对象
            var keys = _.keys(obj);
            for (i = 0, length = keys.length; i < length; i++) {
                iteratee(obj[keys[i]], keys[i], obj);
            }
        }
        //return 目前用不到 [可能只是这个方法以后的扩展吧]
        return obj;
    };
    _.map = _.collect = function (obj, iteratee, context) {
        iteratee = cb(iteratee, context);
        var keys = !isArrayLike(obj) && _.keys(obj),
            length = (keys || obj).length,
            //https://zhuanlan.zhihu.com/p/34772374
            //构造函数 一般需要 new Array()才能创建实例 ，但是javascript语言规范的制定者也加了可以不用new的写法
            results = Array(length);
        for (var index = 0; index < length; index++) {
            var currentKey = keys ? keys[index] : index;
            results[index] = iteratee(obj[currentKey], currentKey, obj);
        }
        return results;
    };


    function createReduce(dir) {
        //iteratee (memo, value, index, list)
        function iterator(obj, iteratee, memo, keys, index, length) {
            for (; index >= 0 && index < length; index += dir) {
                var currentKey = keys ? keys[index] : index;
                //这里用户自定义的回调执行之后，赋值给memo 所以也就明确了在用户层 回调函数的 return 是必须的
                memo = iteratee(memo, obj[currentKey], currentKey, obj);
            }
            return memo;
        }
        return function (obj, iteratee, memo, context) {
            //优化 iteratee函数处理
            iteratee = optimizeCb(iteratee, context, 4);
            var keys = !isArrayLike(obj) && _.keys(obj),
                length = (keys || obj).length,
                index = dir > 0 ? 0 : length - 1;
            // 如果没有提供初始值 index === 1 提供了index === 0
            if (arguments.length < 3) {
                //var obj = { "sname": "wq", "sage": 11 }; ["sname", "wq", "sage"]
                //var arr = [2,3,4];    ["0", "1", "3"]
                // 这里也区分了数组和对象的取值问题  同时也处理了memo没有值得情况下将obj中的第一条数据给memo
                memo = obj[keys ? keys[index] : index];
                index += dir;
            }


            return iterator(obj, iteratee, memo, keys, index, length);
        };
    };


    _.reduce = _.foldl = _.inject = createReduce(1);




    /************实现叠加器*************/
    function createReduceWq(dir) {
        return function (obj, callback, memo, context) {
            //优化callback
            callback = optimizeCb(callback, context, 4);
            //拿到所有的键名（对象） {"sname":"wq", "sage":"12", "city":"bj"} => ["sname", "sage", "city"]
            //或下标（数组）   [2,3,4] => [0, 1 ,2]
            var keys = !isArrayLike(obj) && _.keys(obj);
            //如果是类数组的处理
            var length = (keys || obj).length;
            var index = dir > 0 ? 0 : length - 1;
            if (arguments.length < 3) {
                //不管是对象还
                memo = obj[keys ? keys[index] : index];

            }




        }
    };
    _.reduceWq = createReduceWq(1);
    /*************************/
























    /**
    *  将参数返回 只取对象的键名 Object.keys
    */
    _.keys = function (obj) {
        if (!_.isObject(obj)) return [];
        if (nativeKeys) return nativeKeys(obj);
        var keys = [];
        // 手动处理  Object.keys  =>也是对数组的处理
        for (var key in obj) if (_.has(obj, key)) keys.push(key);
        // Ahem, IE < 9.
        // wq: 暂时不考虑 低版本
        //if (hasEnumBug) collectNonEnumProps(obj, keys);
        return keys;
    };
    wqhash = _.keys
    _.extendOwn = _.assign = createAssigner(wqhash);
    _.isMatch = function (object, attrs) {
        var keys = _.keys(attrs), length = keys.length;
        if (object == null) return !length;
        var obj = Object(object);
        for (var i = 0; i < length; i++) {
            var key = keys[i];
            if (attrs[key] !== obj[key] || !(key in obj)) return false;
        }
        return true;
    };


    /**
    *  判断对象中的属性是不是自身的（不包含prototype中的）
    */
    _.has = function (obj, key) {       //1261
        // 用于判断 key 是不是 obj 的属性
        // hasOwnProperty: 为了判断一个对象是否包含自定义属性而不是原型链上的属性[用hasOwnProperty很合理]
        // As: var obj = {"sname": "wq"} obj.prototype.sage = 11; "sage" in obj =>也会是true 而hashOwnProperty只会查找自身上的，不会找原型的
        return obj != null && hasOwnProperty.call(obj, key);
    };



    //工具方法
    // -----------------
    //start
    _.noConflict = function () {    //1270
        root._ = previousUnderscore;
        return this;
    };
    _.identity = function (value) {
        return value;
    };


    /**
    * 判断是不是一个函数
    * 返回Bool
    */
    if (typeof /./ != 'function' && typeof Int8Array != 'object') {
        _.isFunction = function (obj) {
            return typeof obj == 'function' || false;
        };
    };


    /**
    * 判断是不是一个对象
    * 返回Bool
    */
    _.isObject = function (obj) {
       var type = typeof obj;
       return type === 'function' || type === 'object' && !!obj;
   };



   _.matcher = _.matches = function (attrs) {
       attrs = _.extendOwn({}, attrs);
       return function (obj) {
           return _.isMatch(obj, attrs);
       };
   };


    /**
    *  处理属性的方法
    *  key是一个动态的值   _.property(key)(arr)
    */
   _.property = function (key) {
       return function (obj) {
           return obj == null ? void 0 : obj[key];
       };
   };



    //最后的文件来自 feature-wangqi 的修改

    //};
}.call(this));
