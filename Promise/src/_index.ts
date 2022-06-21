interface handlerProps {
  onResolve: (res) => void;
  onReject: (rej) => void;
  handleNext: Promise2;
}

type PromiseArray = Promise2[]
type State = 'pending' | 'fullfilled' | 'rejected';
class Promise2 {
  state: State = 'pending';
  callbacks: handlerProps[] = [];

  constructor(fn: (resolve: (result: unknown) => void, reject: (reason?: any) => void) => void) {
    if (typeof fn !== 'function') throw new Error('Promise必须传入一个函数');
    try {
      fn(this.resolve.bind(this), this.reject.bind(this));
    } catch (err) {
      this.reject.call(this, err.message);
    }
  }
  resolve(result) {
    console.log('resolve了');
    
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
  static all(array: PromiseArray){
    if (!array.length) return
    const index = array.findIndex(a => a.state!=='fullfilled')
    return new Promise2((res, rej)=>{
      // index === -1 ? res() : rej()
    })
  }
}
const p1 = new Promise((res)=>{
  console.log('--------------');
  res('ok')
})
// const p2 = new Promise((res,rej)=>{
//   console.log(2);
//   rej()
// })

// const p3 = Promise.all([p1, p2])
// // @ts-ignore
// p3.then((res,rej)=>{
//   console.log(res);
//   console.log(rej);
  
// })
export default Promise