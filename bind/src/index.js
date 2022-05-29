var slice = Array.prototype.slice;
// 使用旧api，不能new
function bind2(_this) {
  var fn = this;
  var args = slice.call(arguments, 1);
  return function (...args2) {
    var args2 = slice.call(arguments, 0);
    return fn.apply(_this, args.concat(args2));
  };
}
// 使用新api，部分api可能不支持
function _bind2(_this, ...args) {
  var fn = this;
  return function (...args2) {
    return fn.call(_this, ...args, ...args2);
  };
}

module.exports = bind2;

if (!Function.prototype.bind) {
  Function.prototype.bind = bind2;
}
