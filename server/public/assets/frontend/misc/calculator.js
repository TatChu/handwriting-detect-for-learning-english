(function (name, definition) {
  if (typeof module != 'undefined' && module.exports) module.exports = definition()
  else if (typeof define == 'function' && define.amd) define(definition)
  else this[name] = definition()
})('Calculator', function () {
    function Calculator(){
        return Calculator;
    }
    Calculator.add = function(a,b){
        return a+b;
    }
    Calculator.devide = function(a,b){
        return a/b;
    }
    return Calculator;
})



