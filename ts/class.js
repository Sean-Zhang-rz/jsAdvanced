function Company() {}
// 构造100个对象
// 1. 写100遍，蠢
// 2. 声明一个数组，push100个，蠢，浪费内存
// 3.共有属性
more.prototype = { // 增加内聚
  constructor: more,
  type: '近战',
  money: 42,
  bonus: 16,
  f1: function (){},
  f2: function (){},
  f3: function (){},
  f4: function (){},
}
const createA = function(id: number) { // 构造函数
  const a = { id, hp: 1488, atack: 60, defence: 180 }
  a.__proto__ = more.prototype // a的隐藏属性存储了more属性的地址, 增加内聚
  return a
}
const list = []
for(let i = 0; i < 100; i++) {
  list.push(createA(i))
}
// 封装一下
// 独有属性
  创建对象时声明的属性
// 共有属性
  所有对象共有的属性，例如constructor, toString, prototype等
const A = function (id) {
  this.id = id
  this.hp: 1488,
  this.atack: 60,
  this.defence: 180,
}
A.prototype.type='近战'
A.prototype.money = 42
A.prototype.bonus= 16
A.prototype.f1 = function () { }
A.prototype.f2 = function () { }
A.prototype.f3 = function () { }
A.prototype.f4 = function () { }

// 简化一下
const A = function (id) {
  copy(this, { id, hp: 1488, atack: 60, defence: 180 })
}
A.prototype = {
  constructor: more,
  type: '近战',
  money: 42,
  bonus: 16,
  f1: function () { },
  f2: function () { },
  f3: function () { },
  f4: function () { },
}
const list1 = []
for (let i = 0; i < 100; i++) {
  list1.push(new A(i))
}

// 类型查找规则
先找独有属性，再找共有属性，再找共有属性的共有属性，直到顺着原型链找到null，都没有则认为该属性不存在
// 什么是原型
const a = new A(i)
a的原型是 A.prototype a.__proto__ A.[[Prototype]]
// const a = {name:'as'}
// const f3 = function () {
//   console.log(123);
// }
// a.f3()
Array.__proto__ = Object.prototype

// 如何判断一个东西是函数，可以调用，🦆模型，有所有函数共有属性，就可以作为函数调用