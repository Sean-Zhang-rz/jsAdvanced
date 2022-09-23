import { a } from './a'
const b = import('./b')
import { JSXDemo } from './jsx-demo.jsx'

console.log(JSXDemo)

const hi = () => {
  console.log('sean');
  console.log(a);
  console.log(b);
  console.log(Promise.resolve('test promise'));
}
hi()