interface PointPros {
  x: number;
  y: number;
}
// "strictPropertyInitialization: false"
class PointClass {
  // 对象创建的时候才执行赋值
  x: number = 0;
  y: number = 0;
}
class PointClass1 {
  x: number;
  y: number;
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }
}
class PointClass2 {
  constructor(public x: number = 0, public y: number = 0) {
    this.x = x;
    this.y = y;
  }
}
const p = new PointClass();
const p1 = new PointClass1(1, 2);
const p2 = new PointClass2(2, 3);
p.x = 1;
p.y = 2;
// 重载
class PointClass3 {
  x!: number;
  y!: number;
  constructor(x: number, y: number);
  constructor(s: string);
  constructor(xs: number | string, y?: number) {
    if (typeof xs === 'number' && typeof y === 'number') {
      this.x = xs;
      this.y = y;
    } else if (typeof xs === 'string') {
      const parts = xs.split(',');
      this.x = parseFloat(parts[0]);
      this.y = parseFloat(parts[1]);
    }
  }
}

// Implements
interface Person {
  name: string;
  sayHi: (target: Person) => void;
}
interface Taggable {
  tags: string[];
  color?: string;
  addTag: (tag: string) => void;
  removeTag: (tag: string) => void;
}
class User implements Person, Taggable {
  protected yyy: number;
  constructor(public name: string, public tags: string[], public friend?: User) {
    this.name = name;
    this.tags = [];
    this.friend = friend;
    this.yyy = 1;
  }

  addTag(tag: string) {}
  removeTag(tag: string) {}
  sayHi() {
    console.log(this.name);
  }
}
const user = new User('sean', ['1']);
// 报错，虽然类型声明里有，但是类没有声明
// user.age;

// 继承
class Person1 extends User {
  declare friend?: Person1;
  private xxx: string; // 私有属性，转成js后会被擦除
  #zzz: string; // 真私有属性，转成js后不会被擦除
  static prop = 2; // 静态属性

  constructor(public id: number, name: string, tags: string[], friend?: Person1) {
    super(name, tags, friend);
    this.id = id;
    this.xxx = '1';
    this.#zzz = '2';
  }
  sayHi(target?: User) {
    if (!target) {
      // 调用父类的方法
      super.sayHi();
      console.log(this.yyy); // 子类可用
    } else {
      console.log('hhhh');
      console.log(this.xxx); // 类内部可用
      console.log(this.#zzz);
    }
  }
}
const u1 = new Person1(1, 'sean', ['1']);
const u2 = new Person1(2, 'tom', ['1'], u1);
// 不declare，类型是User
u2.friend;

// 可见属性
u1.name; // public定义的类之外可见属性
Person1.prop; // 静态成员只能通过类访问

// static block
class Foo {
  static #count = 0;
  // static {
    // const count = loadFromLocalStorage() || 0;
    // Foo.#count += count;
  // }
  constructor() {
    console.log(Foo.#count);
  }
}

// 类与泛型
class Hash<K, V> {
  map: Map<K, V> = new Map();
  set(key: K, value: V) {
    this.map.set(key, value);
  }
  get(key: K) {
    return this.map.get(key);
  }
}
class Hash1<K, V> extends Map<K, V> {
  destroy() {}
}
// 匿名class
const Rectangle = class {};
// 抽象类 => 只声明不实现，相当于interface
abstract class C {
  abstract a(): void;
  abstract b(): number;
}
// 如何使用抽象类，再声明一个
class D extends C {
  a() {
    console.log(1);
  }
  b() {
    return 1;
  }
}
// const c = new C() // 抽象类不能实例化 报错
const d = new D();

// 把类本身作为参数
function f(X: typeof Person1) {
  const p = new X(1, 'frank', ['1']);
  console.log(p.name);
}
function f2(X: new (id: number, name: string, tags: string[]) => Person1) {
  // new表示必须是构造函数
  const p = new X(1, 'frank', ['1']);
  console.log(p.name);
}
export {};
