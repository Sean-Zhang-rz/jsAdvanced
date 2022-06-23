var slice = Array.prototype.slice;
// 使用旧api，不能new
function bind2(_this) {
  console.log('this', this);
  var fn = this;
  var args = slice.call(arguments, 1);
  const resultFn = function () {
    var args2 = slice.call(arguments, 0);
    return fn.apply(resultFn.prototype.isPrototypeOf(this) ? this : _this, args.concat(args2));
  };
  resultFn.prototype = fn.prototype;
  return resultFn;
}
// 使用新api，部分api可能不支持
function _bind2(_this, ...args) {
  var fn = this;
  const resultFn = function (...args2) {
    console.log('this', this);
    // 判断是否为new调用的，这句return会覆盖new的默认return this, 参数就会绑定到window/global上
    return fn.call(resultFn.prototype.isPrototypeOf(this) ? this : _this, ...args, ...args2);
  };
  resultFn.prototype = fn.prototype;
  return resultFn;
}

module.exports = bind2;

Function.prototype.bind2 = _bind2;
var name = 'Jack';

function person(age, job, gender) {
  this.age = age
  this.job = job
  this.gender = gender
  console.log(this.name, age, job, gender);
}
var Yve = {
  name: 'Yvette'
};
let result = person.bind2(Yve, 22, 'enginner')
const obj = new result()
console.log(obj);