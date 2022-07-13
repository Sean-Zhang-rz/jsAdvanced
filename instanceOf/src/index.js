function _instanceof(left, right){
  let prototype = right.prototype;
  let l = left.__proto__;
  while(true) {
    if (l == null) return false;
    if (prototype === l) return true;
    l = l.__proto__;
  }
}
console.log(_instanceof(Function, Object));
class Parent {}
const p = new Parent()
console.log(_instanceof(p, Parent));