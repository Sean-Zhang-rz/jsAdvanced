import { a } from './a'
const b = import('./b')
const hi = () => {
  console.log('sean');
  console.log(a);
  console.log(b);
  console.log(Promise.resolve('test promise'));
}
hi()