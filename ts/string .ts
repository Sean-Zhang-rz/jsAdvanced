// Uppercase Lowercase Uncapitalize Capitalize
type A = 'sean';
type B = Capitalize<A>;

type C = 'a' | 'b' | 'c';
type D = Capitalize<C>;

// 组合字符串
type E = 'a';
type F = 'b';
type G = `${E} ${F}`; // a b

// 获取第一个字符
type First<T extends string> = T extends `${infer F}${string}` ? F : never;
type Result = First<'ji ni tai mei'>; // j
// 获取最后一个字符
// 先将字符串转换成元祖，再获取元祖最后一项
type Last<T extends unknown[]> = T extends [...infer First, infer Last] ? Last : never;
type StringToTuple<S extends string> = S extends `${infer F}${infer R}`
  ? [F, ...StringToTuple<R>]
  : [];
type LastOfString<S extends string> = Last<StringToTuple<S>>;

// 字符串转换成联合类型 递归 自动去重
type StringToUnion<S extends string> = S extends `${infer First}${infer Rest}`
  ? First | StringToUnion<Rest>
  : never;
type Result1 = StringToUnion<'ji ni tai mei'>;
export {};
