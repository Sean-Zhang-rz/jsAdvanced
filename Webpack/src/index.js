import a from './a.js';
import JSXDemo from './jsx-demo.jsx';
import { TsxDemo } from 'src/tsx-demo.tsx';
import c from './ts-demo.ts';
import vars from 'src/scss-export.scss';
import varsLess from 'src/less-vars.less';
import React from 'react';
import shared from './shared.js';
import './scss-demo.scss';
import 'src/less-demo.less';
const b = import('./b');

console.log(shared);
console.log(React);
console.log(vars.color);
console.log(varsLess);
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
