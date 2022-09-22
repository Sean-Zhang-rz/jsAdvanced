const header = <h1 name={123}>hi</h1>;
header.tag;
declare global {
  namespace JSX {
    interface Element {
      tag: string[];
    }
    interface IntrinsicElements {
      h1: {
        name?: number;
      };
    }
  }
}

export {};
