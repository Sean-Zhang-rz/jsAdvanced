import a from './a.js';
import JSXDemo from './jsx-demo.jsx';
import { TsxDemo } from 'src/tsx-demo.tsx';
import c from './ts-demo.ts';
import vars from 'src/scss-export.scss';
import './scss-demo.scss';
import 'src/less-demo.less';
const b = import('./b');

console.log(vars);
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
