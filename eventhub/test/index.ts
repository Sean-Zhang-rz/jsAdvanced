import EventHub from '../src';

const eventHub = new EventHub();

// console.assert(eventHub instanceof Object === true, 'eventHub是对象');

eventHub.on('xxx', (y: unknown) => {
  console.log('被调用');
  console.log(y);
});

eventHub.emit('xxx', '今天很开心');

const e2 = new EventHub();
const fn1 = () => {
  called2 = true;
};
let called2 = false;
e2.on('yyy', fn1);
e2.off('yyy', fn1);

e2.emit('yyy');

setTimeout(() => {
  console.log(called2);
}, 1000);
