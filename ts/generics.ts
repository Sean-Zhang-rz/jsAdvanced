// 泛型
type Result<A, B> = A | B
type Result2<A, B> = A & B
interface Props<T> {
  [k: string]: T
}

type Result3 = Props<number>
// 默认类型
interface Props1<T = string> {
  [k: string]: T
}
type Result4 = Props1

// extends 条件类型
type LikeString<T> = T extends string ? true : false
type R1 = LikeString<'1'>
type R1s = LikeString<true>
let r1: R1 // 恒定为true
let r1s: R1s  // 恒定为false

type LikeNumber<T> = T extends number ? 1 : 2
type R2 = LikeNumber<1>
type R2s = LikeNumber<true>
let r2: R2 // 恒定为1
let r2s: R2s  // 恒定为2

type Persons = { name: string }
type LikePerson<T> = T extends Persons ? 'yes' : 'no'
type R3 = LikePerson<{ name: 'sean' }>
type R3s = LikePerson<{ name: 1 }>
let r3: R3 // 恒定为yes
let r3s: R3s  // 恒定为no

// 复杂情况
type X = LikeString<never>
let x: X // 恒定为never

type ToArray<T> = T extends unknown ? T[] : never;
type R4 = ToArray<string | number> // 结果是string[] | number[] 先把类型收窄分开计算，再做泛型计算

type R5 = ToArray<never> // 结果是never

// keyof 
type Person3 = { name: string, age: number }
type GetKeys<T> = keyof T
type R6 = GetKeys<Person3>
let r6: R6 = 'name';
// let r7: R6 = 'names' // 错误

// extends keyof 泛型约束
type GetKeysType<T, K extends keyof T> = T[K]
type R7 = GetKeysType<Person3, 'name'> // string
type R8 = GetKeysType<Person3, 'age'> // number

// 