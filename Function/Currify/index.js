const currify =
  (fn, params = []) =>
  (...args) =>
    params.length + args.length === fn.length
      ? fn(...params, ...args)
      : currify(fn, [...params, ...args]);

const addTwo = (a, b) => a + b;

const addFour = (a, b, c, d) => a + b + c + d;

const cAddTwo = currify(addTwo);
const cAddFour = currify(addFour);

console.log(cAddFour(1)(2, 3)(4));
console.log(cAddFour(1)(2)(3)(4));
