const header = <h1 name={123}>hi</h1>;
header.tag;
declare global {
  namespace JSX {
    // 没搞明白
    // interface ElementChildrenAttribute {
    //   children: {}
    // }
    interface Element {
      tag: string[];
    }

    // 共有属性
    interface IntrinsicAttributes {
      key?: string;
      id?: string;
    }
    // ref
    interface IntrinsicClassAttributes<T> {
      ref?: {
        current: T | null;
      };
    }
    interface IntrinsicElements {
      h1: {
        name?: number;
      } & IntrinsicAttributes;
    }
  }
}

export {};
