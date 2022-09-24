import a from './a';
import JSXDemo from './jsx-demo.jsx';
import { TsxDemo } from '@/Webpack/src/tsx-demo.tsx';
import c from './ts-demo.ts';
const b = import('./b');

console.log(TsxDemo);

console.log(JSXDemo);
console.log(c);
const hi = () => {
  console.log('sean');
  console.log(a);
  console.log(b);
  console.log(Promise.resolve('test promise'));
};
hi();
