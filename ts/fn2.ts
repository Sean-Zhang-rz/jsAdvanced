// 函数重载，同名不同参
function createDate(n: number): Date;
function createDate(year: number, month: number, date: number): Date;

function createDate(a: number, b?: number, c?: number): Date {
  if(arguments.length === 3) {
    return new Date(a, b, c)
  } else if (arguments.length === 1) {
    return new Date(a)
  } else {
    throw Error('只接受一个或者三个参数')
  }
}

createDate(12522332222)
createDate(2022, 0, 1)
// createDate(2022, 0)

// 指定函数this
type Person = {
  name: string
}
function f1(this: Person, word: string) {
  console.log(this.name + ' ' + word);
}
// 方法1 拼凑person.f1
const p: Person & {f1?: typeof f1} = {name: 'frank'}
p.f1('hi')

// 直接在Person上声明方法

// 方法2 使用call
f1.call({ name: 'sean' }, 'hi')
// 方法3 使用apply
f1.apply({ name: 'sean' }, ['hi'])
// 方法4 使用bind
f1.bind({ name: 'sean' })('hi')

// 剩余参数
function sum(...nums: number[]) {
  return nums.reduce((a, b) => a + b, 0)
}