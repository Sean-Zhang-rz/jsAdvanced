// 元祖拓展
type A = [number, string];
type B = [...A, string];
type C = [...A, ...B];
export {};
// 元祖缩窄
type D = [1, 2, 3, 4];
type Last<T extends unknown[]> = T extends [...infer First, infer Last] ? Last : never;
type L = Last<D>;
export {};
