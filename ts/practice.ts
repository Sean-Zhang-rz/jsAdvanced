// 实现Pick
type MyPick<T, K extends keyof T> = {
  [P in K]: T[P];
};
// 实现Parameters
type MyParameters<F extends (...args: any[]) => any> = F extends (
  ...args: infer Parameters
) => unknown
  ? Parameters
  : never;

// awaited
type MyAwaited<T extends Promise<any>> = T extends Promise<infer X>
  ? X extends Promise<any>
    ? MyAwaited<any>
    : X
  : T;

// Zip
type MyZip<A extends any[], B extends any[]> = A extends [infer AFirst, ...infer ARest]
  ? B extends [infer BFirst, ...infer BRest]
    ? [[AFirst, BFirst], ...MyZip<ARest, BRest>]
    : []
  : [];

// IsTuple
type MyIsTuple<T> = [T] extends [never]
  ? false
  : T extends readonly any[]
  ? number extends T['length']
    ? false
    : true
  : T extends { length: number }
  ? false
  : true;

// join
type MyJoin<T extends string[], U extends string | number> = T extends [infer First, ...infer Rest]
  ? First extends string
    ? Rest extends string[]
      ? Rest['length'] extends 0
        ? First
        : `${First}${U}${MyJoin<Rest, U>}`
      : ''
    :never
  :never
