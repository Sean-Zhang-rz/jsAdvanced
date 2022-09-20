// 函数重载，同名不同参
function createDate(n: number): Date;
function createDate(year: number, month: number, date: number): Date;

function createDate(a: number, b?: number, c?: number): Date {
  if (arguments.length === 3) {
    return new Date(a, b!, c);
  } else if (arguments.length === 1) {
    return new Date(a);
  } else {
    throw Error('只接受一个或者三个参数');
  }
}

createDate(12522332222);
createDate(2022, 0, 1);
// createDate(2022, 0)

// 指定函数this
type Person = {
  name: string;
};
function f1(this: Person, word: string) {
  console.log(this.name + ' ' + word);
}
// 方法1 拼凑person.f1
const p: Person & { f1?: typeof f1 } = { name: 'frank' };
// p.f1('hi');

// 直接在Person上声明方法

// 方法2 使用call
f1.call({ name: 'sean' }, 'hi');
// 方法3 使用apply
f1.apply({ name: 'sean' }, ['hi']);
// 方法4 使用bind
f1.bind({ name: 'sean' })('hi');

// 剩余参数
function sum(...nums: number[]) {
  return nums.reduce((a, b) => a + b, 0);
}
// 展开参数
function s(...array: number[]) {
  console.log(array);
}

function sum2(...nums: number[]) {
  s(...nums);
  return nums.reduce((a, b) => a + b, 0);
}
// as const
const a12 = 'b';
type A12 = typeof a12;
let a13 = 'b';
type A13 = typeof a13;

let a14 = 'c' as const; // 尽管使用let，但还是收紧到常量'c'
type A14 = typeof a14;

let arr = [1, '2'] as const;
// arr.push('3'); // 报错了
function sum3(...nums: number[]) {
  // const nums1 = [1, 2] // 报错了
  const nums1 = [1, 2] as const;
  s1(...nums1);
  return nums.reduce((a, b) => a + b, 0);
}
function s1(a: number, b: number) {
  console.log(a, b);
}

// 解构
type Config = {
  url: string;
  method: 'GET' | 'POST';
  data?: unknown;
  headers?: unknown;
};
function ajax({ url, method, ...rest }: Config = { method: 'GET', url: '' }) {
  console.log(url, method, rest);
}

// void 返回值
function fv(): void {}
function fv1(): void {
  return;
}
function fv2(): void {
  return undefined;
}
function fv3(): void {
  // 可能会报错，可以关闭tsconfig里的null检查
  //return null;
}
export {};
