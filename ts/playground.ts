// 1
type A = 1;
type B = 1 | 2;
type C = 3;
type D = 3 | 4;
type Result1 = A extends B
  ? C extends D
    ? 'true, true'
    : 'true, false'
  : C extends D
  ? 'false, true'
  : 'false, false';

// 2. 元祖
type Arr = [];
type IsEmptyArray<Arr extends unknown[]> = Arr['length'] extends 0 ? true : false;
type Result2 = IsEmptyArray<Arr>;

// 2.1 非空数组
type NotEmpty<Arr extends unknown[]> = Arr extends [...unknown[], unknown] ? true : false;
type NotEmpty1<Arr extends unknown[]> = Arr extends [...infer X, infer Y] ? true : false;

// 3. 递归 最多48次
// 3.1 翻转数组
type Arr3 = ['ji', 'ni', 'tai', 'mei'];
type Reverse<Arr extends unknown[]> = Arr extends [...infer Rest, infer Last]
  ? [Last, ...Reverse<Rest>]
  : Arr;
type Result3 = Reverse<Arr3>;

// 4. 模式匹配
type Result4 = Arr3 extends [infer First, ...infer Rest] ? First : never;
type Result41 = Arr3 extends [infer First, ...infer Rest] ? Rest : never;

export {};
