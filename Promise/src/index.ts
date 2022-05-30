class Promise2 {
  onResolve = null;
  onRejected = null;
  state = 'pending';
  callbacks = [];

  resolve(result) {
    if (this.state !== 'pending') return;
    this.state = 'fullfilled';
    queueMicrotask(() => {
      this.callbacks.forEach((handle) => {
        if (handle.onResolve) {
          const x = handle.onResolve.call(undefined, result);
          handle.handleNext.resolveWith(x);
        }
      });
    });
  }
  reject(reason) {
    if (this.state !== 'pending') return;
    this.state = 'rejected';
    queueMicrotask(() => {
      this.callbacks.forEach((handle) => {
        if (handle.onRejected) {
          const x = handle.onRejected.call(undefined, reason);
          handle.handleNext.resolveWith(x);
        }
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
      onResolve?: () => Promise2;
      onRejected?: () => Promise2;
      handleNext?: Promise2;
    } = {};
    if (typeof onResolve === 'function') handle.onResolve = onResolve;
    if (typeof onRejected === 'function') handle.onRejected = onRejected;
    handle.handleNext = new Promise2(() => {});
    this.callbacks.push(handle);
    return handle.handleNext;
  }
  resolveWith(x) {
    // x 和this不能是同一个引用
    if (this === x) return this.reject(new TypeError());
    // 如果then是promise
    if (x instanceof Promise2) {
      x.then(
        (result) => {
          this.resolve(result);
        },
        (reason) => {
          this.reject(reason);
        }
      );
    } else if (x instanceof Object) {
      // let then be x.then, 且处理异常, 如果then可调用，就调用它
      let then;
      try {
        then = x.then;
      } catch (e) {
        this.reject(e);
      }
      if (then instanceof Function) {
        try {
          x.call(
            (y) => {
              this.resolveWith(y);
            },
            (r) => {
              this.reject(r);
            }
          );
        } catch (e) {
          this.reject(e);
        }
      } else {
        this.resolve(x);
      }
    } else {
      this.resolve(x);
    }
  }
}
export default Promise2;
