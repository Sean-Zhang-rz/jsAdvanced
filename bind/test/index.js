const bind2 = require('../src/index');

Function.prototype.bind2 = bind2;

test1('fn.bind2能使用');
test2('this 绑定成功');
test3('this, p1, p2 绑定成功');
test4('this, p1 绑定成功, 后传p2绑定成功');
test5('new的时候绑定p1, p2');
test6('new的时候绑定p1, p2, 并且sayHi');
test7('不用new 但是用类似的对象');

function test1(message) {
  console.log(message);
  console.assert(Function.prototype.bind2 !== undefined);
}
function test2(message) {
  console.log(message);
  const fn1 = function () {
    return this;
  };
  const newFn1 = fn1.bind2({ name: 'sean' });
  console.assert(newFn1().name === 'sean');
}

function test3(message) {
  console.log(message);
  const fn2 = function (p1, p2) {
    return [this, p1, p2];
  };
  const newFn2 = fn2.bind2({ name: 'sean' }, 123, 456);
  console.assert(newFn2()[0].name === 'sean');
  console.assert(newFn2()[1] === 123);
  console.assert(newFn2()[2] === 456);
}

function test4(message) {
  console.log(message);
  const fn2 = function (p1, p2) {
    return [this, p1, p2];
  };
  const newFn2_2 = fn2.bind2({ name: 'sean' });
  console.assert(newFn2_2(123, 456)[0].name === 'sean');
  console.assert(newFn2_2(123, 456)[1] === 123);
  console.assert(newFn2_2(123, 456)[2] === 456);
}

function test5(message) {
  console.log(message);
  const fn = function (p1, p2) {
    this.p1 = p1;
    this.p2 = p2;
  };
  const fn2 = fn.bind2(undefined, 'x', 'y');
  const obj = new fn2();
  console.assert(obj.p1 === 'x');
  console.assert(obj.p2 === 'y');
}

function test6(message) {
  console.log(message);
  const fn = function (p1, p2) {
    this.p1 = p1;
    this.p2 = p2;
  };
  fn.prototype.saiHi = function () {};
  const fn2 = fn.bind2(undefined, 'x', 'y');
  const obj = new fn2();
  console.assert(obj.p1 === 'x');
  console.assert(obj.p2 === 'y');
  console.assert(obj.__proto__ === fn.prototype);
  console.assert(typeof obj.saiHi === 'function');
}

function test7(message) {
  console.log(message);
  const fn = function (p1, p2) {
    this.p1 = p1;
    this.p2 = p2;
  };
  fn.prototype.saiHi = function () {};
  const obj1 = new fn('a', 'b');
  console.log('1', obj1);
  const fn2 = fn.bind2(obj1, 'x', 'y');
  console.log('2', obj1);
  const obj = fn2();
  console.assert(obj === undefined);
  console.assert(obj1.p1 === 'x');
  console.assert(obj1.p2 === 'y');
  // console.assert(obj.__proto__ === fn.prototype);
  // console.assert(typeof obj.saiHi === 'function');
}
