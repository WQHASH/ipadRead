(function(){
	var obj = {"sname":"wq","sage":"12","sex":"man"};
	var arr = [22,3,46];

	// _.find(obj, function(val, key, list){console.log(arguments,"find")});


})();


(function(){
	var sum = _.reduce([11, 22, 33], function(memo, num){console.log(arguments); return memo + num; });
	// console.log(sum, "reduce")
})();

(function(){

	function cb(){return arguments};
	var fn = _.invoke([[5, 1, 7], [3, 2, 1]], "sort");
	// console.log(fn,"fn")
})();

console.log("====== _.max ======");
(function() {
    /**
     * _.max(list [,iteratee] [,context])
     *   list： 指的是数组或对象
     *   iteratee：迭代器，这里 _.max 方法内部 用了cb(iteratee) =>它对iteratee的形式做了不同的处理
     */

    var stooges = [{ name: 'moe', age: 40 }, { name: 'larry', age: 50 }, { name: 'curly', age: 60 }];
    var obj = [1, 3]
    var elem = _.max(stooges, 'age'); //有 list 有  age[iteratee]
    //var elem = _.max(obj);          //只有list
    //var elem = _.max();             // 全无 => 这时因为无list 这里会返回 -Infinity 所以需要对 list进行判断
    // console.log(elem, "elem ");
})();

(function(){

    var arr = [55,55,77,77,77,99];
    var firstNum = _.uniq (arr);
    console.log(arr,"arr");
    console.log(firstNum,"firstNum");
})();

console.log("===bind===");
(function(){
      // 偏函数[和柯里化]理解 => https://blog.csdn.net/neweastsun/article/details/75947785
      // 理解: 我们创建一个新函数， 让现有的一些参数值固定。作为默认参数使用
      // 好处: 默认参数不用写
      this.x = 9;
      var model = {
        x: 8,
        getX: function(){
          // console.log(this.x);
          console.log(Array.prototype.slice.apply(arguments));
        },
      };
      model.getX();
      var retriverX = model.getX;
      retriverX();

      _.bind(model.getX, model,"首个参数")(1,2,4,5);
})();

console.log("===debounce===");
(function(){
  var cb = function(){
    console.log(111,"xxxxxxxxx");
  };
  var lazyLayOut = _.debounce(cb, 300);
  window.onresize = lazyLayOut;
})();

console.log("=== _.after ===");
(function(){
   var cb = function(){console.log(" _.after")};
   var after = _.before(3,cb);
   document.getElementsByClassName("btn")[0].onclick = after;
})();

console.log("=== _.compose ===");
(function(){
   var greet    = function(name){ return "hi: " + name; };
  var exclaim  = function(statement){ return statement.toUpperCase() + "!"; };
  var welcome = _.compose(greet, exclaim);
  console.log(welcome('moe'),"compse");
})();

