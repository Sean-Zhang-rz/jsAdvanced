// 对象语法都适用于函数
type F = {
  (a: number): number;
  // 这种写法可以为函数额外声明属性
  count: number;
};
type F1 = (a: number) => number;
// 返回值类型可以省略，参数类型也可以省略，因为已经给f声明类型F了
const f: F = (x) => x + 2;
f.count = 1;

const f2 = (y: number) => y + ' ' + 'hhhh';
type F2 = typeof f2;

// 没人用的写法
const f5 = new Function('a', 'b', 'return a + b');
type F5 = typeof f5;

// 类型谓词 is
type A1 = {
  name: string;
};
type B1 = {};
function ff(x: A1 | B1) {
  if (isA1(x)) {
    x; // A1
  } else {
    x; // B1
  }
  if (isA12(x)) {
    x; // 区分不出
  } else {
    x; // 区分不出
  }
}
function isA12(x: A1 | B1): boolean {
  if ('name' in x) {
    x;
    return true;
  } else {
    x;
    return false;
  }
}

function isA1(x: A1 | B1): x is A1 {
  if ('name' in x) {
    return true;
  } else {
    return false;
  }
}
// 箭头函数不能把谓词写在左边
// const fnArray: (x: A1 | B1) => x is A1 = (x) => 'name' in x

// 参数可选
function fn6(a: number, b: string, c = false) {
  console.log(a, b, c);
}
fn6(1, '2');

// 函数返回函数（柯里化）
type Fn7 = (a: number) => (b: number) => number;
const createAdd: Fn7 = (a: number) => (b: number) => a + b;
export {};
