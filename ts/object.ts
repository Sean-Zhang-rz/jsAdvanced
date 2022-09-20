type Hash = {
  // 索引签名
  [k: string]: number;
  length: number;
};

type Hashs = {
  // 映射类型, 不能再声明其他类型
  [k in string]: unknown;
};
// 问号表示可选
interface A {
  name: string;
  age?: number;
  gender: string | undefined;
}

const a1: A = {
  name: 'sean',
  gender: 'male', // 必传，age就可以不传，?与undefined的区别
};

// readonly 只读
interface User {
  readonly id: number;
}
const a2: User = { id: 111 };
// a2.id = 222

export {};
