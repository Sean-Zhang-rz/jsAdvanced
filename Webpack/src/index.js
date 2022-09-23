import a from './a';
import JSXDemo from './jsx-demo.jsx';
const b = import('./b');

console.log(JSXDemo);

const hi = () => {
  console.log('sean');
  console.log(a);
  console.log(b);
  console.log(Promise.resolve('test promise'));
};
hi();
