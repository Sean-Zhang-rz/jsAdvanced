// 泛型
type Result<A, B> = A | B;
type Result2<A, B> = A & B;
interface Props<T> {
  [k: string]: T;
}

type Result3 = Props<number>;
// 默认类型
interface Props1<T = string> {
  [k: string]: T;
}
type Result4 = Props1;

// extends 条件类型
type LikeString<T> = T extends string ? true : false;
type R1 = LikeString<'1'>;
type R1s = LikeString<true>;
let r1: R1; // 恒定为true
let r1s: R1s; // 恒定为false

type LikeNumber<T> = T extends number ? 1 : 2;
type R2 = LikeNumber<1>;
type R2s = LikeNumber<true>;
let r2: R2; // 恒定为1
let r2s: R2s; // 恒定为2

type Persons = { name: string };
type LikePerson<T> = T extends Persons ? 'yes' : 'no';
type R3 = LikePerson<{ name: 'sean' }>;
type R3s = LikePerson<{ name: 1 }>;
let r3: R3; // 恒定为yes
let r3s: R3s; // 恒定为no

// 复杂情况
type X = LikeString<never>;
let x: X; // 恒定为never

type ToArray<T> = T extends unknown ? T[] : never;
type R4 = ToArray<string | number>; // 结果是string[] | number[] 先把类型收窄分开计算，再做泛型计算

type R5 = ToArray<never>; // 结果是never

// keyof
type Person3 = { name: string; age: number };
type GetKeys<T> = keyof T;
type R6 = GetKeys<Person3>;
let r6: R6 = 'name';
// let r7: R6 = 'names' // 错误

// extends keyof 泛型约束
type GetKeysType<T, K extends keyof T> = T[K];
type R7 = GetKeysType<Person3, 'name'>; // string
type R8 = GetKeysType<Person3, 'age'>; // number

// in
// 生成所有键都是readonly的类型
type ReadonlyPerson<T> = {
  readonly [K in keyof T]: T[K];
};
type P3 = ReadonlyPerson<Person3>;
// 特殊情况，两个k的类型是不一样的，带冒号的k是string和number的并集
type X4 = {
  [k: string]: number;
};
type X5 = {
  [k in string]: number;
};
type X6 = keyof X4;
// Partial
// 生成所有都是可选的
type P4 = Partial<Person3>;
// 同Partial
type Partial2<T> = {
  [K in keyof T]?: T[K];
};

// Required
type P5 = Required<Person3>;
type Required2<T> = {
  [K in keyof T]-?: T[K];
};

// Record 相当于 { [k: string]: number }
type X3 = Record<string, number>;
type Record2<Key extends string | number | symbol, Value> = {
  [k in Key]: Value;
};

// Exclude，做减法
type X7 = Exclude<1 | 2 | 3, 1 | 2>;
type Exclude2<A, B> = A extends B ? never : A;
// 1 extends 1 | 2 ? never : 1 => never |
// 2 extends 1 | 2 ? never : 2 => never |
// 3 extends 1 | 2 ? never : 3 => 3
// 3

// Extract 是Exclude的反操作
type X8 = Extract<1 | 2 | 3, 2 | 4>; // 2
type Extract2<A, B> = A extends B ? A : never;

// Omit **** ts没有提供删除一个key的功能，所以正面实现Omit比较困难，可以反面实现Pick的反向
type X9 = Omit<Person3, 'name'>; // age: number
type Omit2<T, K extends keyof T> = {
  [K2 in keyof T as K2 extends K ? never : K]: T;
};
type X10 = Omit<Person3, 'age'>; // name: string

type X11 = Pick<Person3, 'age'>;

type Pick2<T, Key extends keyof T> = {
  [k2 in Key]: T[k2];
};

type Omit3<T, Key extends keyof T> = Pick<T, Exclude<keyof T, Key>>;

// -readonly 去掉所有readonly
type Mutable<T> = {
  -readonly [K in keyof T]: T[K];
};
// -只能减问号和readonly
export {};
