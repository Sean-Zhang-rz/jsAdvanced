class Promise2 {
  succeed = null;
  fail = null;
  state = 'pending';
  callbacks = [];

  resolve(result) {
    if (this.state !== 'pending') return;
    this.state = 'fullfilled';
    queueMicrotask(() => {
      this.callbacks.forEach((handle) => {
        if (handle.onResolve) handle.onResolve.call(undefined, result);
      });
    });
  }
  reject(reason) {
    if (this.state !== 'pending') return;
    this.state = 'rejected';
    queueMicrotask(() => {
      this.callbacks.forEach((handle) => {
        if (handle.onRejected) handle.onRejected.call(undefined, reason);
      });
    });
  }
  constructor(fn) {
    if (typeof fn !== 'function') {
      throw new Error('Promise必须传入一个函数');
    }
    // 处理fn过程中的抛错
    try {
      fn(this.resolve.bind(this), this.reject.bind(this));
    } catch (e) {
      this.reject.bind(this, e);
    }
  }
  then(onResolve?, onRejected?) {
    const handle: {
      onResolve?: () => void;
      onRejected?: () => void;
    } = {};
    if (typeof onResolve === 'function') handle.onResolve = onResolve;
    if (typeof onRejected === 'function') handle.onRejected = onRejected;
    this.callbacks.push(handle);
    return new Promise2(() => {});
  }
}
export default Promise2;
