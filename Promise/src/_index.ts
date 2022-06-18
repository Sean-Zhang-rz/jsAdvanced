interface handlerProps {
  onResolve: (res) => void;
  onReject: (rej) => void;
  handleNext: Promise2;
}
type State = 'pending' | 'fullfilled' | 'rejected';
export default class Promise2 {
  state: State = 'pending';
  callbacks: handlerProps[] = [];

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
      this.callbacks.forEach((cb) => {
        if (cb.onResolve) {
          const x = cb.onResolve.call(undefined, result);
          // 执行next
          cb.handleNext.resolve(x);
        }
      });
    });
  }
  reject(reason) {
    if (this.state !== 'pending') return;
    this.state = 'rejected';
    queueMicrotask(() => {
      this.callbacks.forEach((cb) => {
        if (cb.onReject) {
          const x = cb.onReject.call(undefined, reason);
          // 执行next
          cb.handleNext.reject(x);
        }
      });
    });
  }
  then(onResolve?, onReject?) {
    const handler: handlerProps = {
      onResolve: (res) => {},
      onReject: (rej) => {},
      handleNext: new Promise2(() => {}),
    };
    if (typeof onResolve === 'function') handler.onResolve = onResolve;
    if (typeof onReject === 'function') handler.onReject = onReject;
    this.callbacks.push(handler);
    return handler.handleNext;
  }
  catch(onReject?) {
    this.then(null, onReject);
  }
}
