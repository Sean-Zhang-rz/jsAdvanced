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
  constructor(public name: string, public tags: string[], public friend?: User) {
    this.name = name;
    this.tags = [];
    this.friend = friend;
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
  constructor(public id: number, name: string, tags: string[], friend?: Person1) {
    super(name, tags, friend);
    this.id = id;
  }
  sayHi(target?: User) {
    if (!target) {
      // 调用父类的方法
      super.sayHi();
    } else {
      console.log('hhhh');
    }
  }
}
const u1 = new Person1(1, 'sean', ['1']);
const u2 = new Person1(2, 'tom', ['1'], u1);
// 不declare，类型是User
u2.friend;
export {};
