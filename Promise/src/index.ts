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

  private resolveWith(x) {
    // x 和this不能是同一个引用
    if (this === x) {
      this.resolveSelf();
    } else if (x instanceof Promise2) {
      // 如果then是promise
      this.resolvePromise(x);
    } else if (x instanceof Object) {
      this.resolveObject(x);
    } else {
      this.resolve(x);
    }
  }
  private resolveSelf() {
    return this.reject(new TypeError());
  }
  resolvePromise(x) {
    x.then(
      (result) => {
        this.resolve(result);
      },
      (reason) => {
        this.reject(reason);
      }
    );
  }
  resolveObject(x) {
    const then = this.getThen(x);
    if (then instanceof Function) {
      this.resolveThenable(x);
    } else {
      this.resolve(x);
    }
  }
  private resolveThenable(x) {
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
  }
  private getThen(x) {
    let then;
    try {
      // let then be x.then, 且处理异常, 如果then可调用，就调用它
      then = x.then;
    } catch (e) {
      return this.reject(e);
    }
    return then;
  }
}
export default Promise2;