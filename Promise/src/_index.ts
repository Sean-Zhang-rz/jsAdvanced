class _Promise {
  state = 'pending';
  handler = {
    onResolve: (res) => {},
    onReject: (rej) => {},
  };

  constructor(fn) {
    if (typeof fn !== 'function') throw new Error('Promise必须传入一个函数');
    fn(this.resolve, this.reject);
  }

  resolve(result) {
    if (this.state !== 'pending') return;
    this.state = 'fullfilled';
    queueMicrotask(() => {
      if (this.handler.onResolve) this.handler.onResolve(result);
    });
  }
  reject(reason) {
    if (this.state !== 'pending') return;
    this.state = 'rejected';
    queueMicrotask(() => {
      if (this.handler.onReject) this.handler.onReject(reason);
    });
  }
  then(onResolve?, onReject?) {
    if (typeof onResolve === 'function') this.handler.onResolve = onResolve;
    if (typeof onReject === 'function') this.handler.onReject = onReject;
  }
}

const p1 = new _Promise((res, rej) => {
  // console.log(1);
  res(1);
});
// p1.then((res) => {
//   console.log(res);
// });
