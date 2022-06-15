class _Promise {
  state: 'pending' | 'fullfilled' | 'rejected' = 'pending';
  handler: {
    onResolve: (res) => void;
    onReject: (rej) => void;
  } = {
    onResolve: (res) => {},
    onReject: (rej) => {},
  };

  constructor(fn) {
    if (typeof fn !== 'function') throw new Error('Promise必须传入一个函数');
    try {
      fn(this.resolve.bind(this), this.reject.bind(this));
    } catch (err) {
      this.reject.call(this, err.message);
    }
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
  catch(onReject?) {
    this.then(null, onReject);
  }
}

const p1 = new _Promise((res, rej) => {
  // res(1);
  throw Error('12121');
});

p1.then(
  (res) => {
    console.log(res);
  },
  (rej) => {
    console.log(rej);
  }
);
