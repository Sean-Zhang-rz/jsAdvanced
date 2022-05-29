const bind2 = require('../src/index');

Function.prototype.bind2 = bind2;
console.assert(Function.prototype.bind2 !== undefined);
const fn1 = function () {
  return this;
};
const newFn1 = fn1.bind2({ name: 'sean' });
console.assert(newFn1().name === 'sean');

const fn2 = function (p1, p2) {
  return [this, p1, p2];
};
const newFn2 = fn2.bind2({ name: 'sean' }, 123, 456);
console.assert(newFn2()[0].name === 'sean');
console.assert(newFn2()[1] === 123);
console.assert(newFn2()[2] === 456);

const newFn2_2 = fn2.bind2({ name: 'sean' });
// console.assert(newFn2_2(123, 456)[0].name === 'sean');
console.assert(newFn2_2(123, 456)[1] === 123);
// console.log(newFn2_2(123, 456));
console.assert(newFn2_2(123, 456)[2] === 456);
