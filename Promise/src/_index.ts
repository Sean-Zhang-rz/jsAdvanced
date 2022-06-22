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
    if (this.state !== 'pending') return;
    this.state = 'fullfilled';
    nextTick(() => {
      this.callbacks.forEach((cb) => {
        if (cb.onResolve) {
          const x = cb.onResolve.call(undefined, result);
          // 执行next
          cb.handleNext.resolveWith(x);
        }
      });
    });
  }
  reject(reason) {
    if (this.state !== 'pending') return;
    this.state = 'rejected';
    nextTick(() => {
      this.callbacks.forEach((cb) => {
        if (cb.onReject) {
          const x = cb.onReject.call(undefined, reason);
          // 执行next
          cb.handleNext.resolveWith(x);
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
    const arr = []
    let count = 0
    return new Promise2((res, rej) => {

    })
  }
  resolveWith(x) {
    if (x instanceof Promise2) {
      x.then((result)=>{
        this.resolve(result)
      },(reason)=>{
        this.reject(reason)
      })
    }else {
      this.resolve(x)
    }
  }
}

function nextTick(fn) {
  if (process !== undefined && typeof process.nextTick === "function") {
    return process.nextTick(fn);
  } else {
    var counter = 1;
    var observer = new MutationObserver(fn);
    var textNode = document.createTextNode(String(counter));

    observer.observe(textNode, {
      characterData: true
    });

    counter = counter + 1;
    textNode.data = String(counter);
  }
}

// const p1 = new Promise2((res)=>{
//   res(new Promise2((res)=>{
//     res('ok')
//   }))
// })
// p1.then(res=>{
//   console.log(res);
// })
// const p2 = new Promise2((res,rej)=>{
//   res('ok2')
// })

// const p3 = Promise2.all([p1, p2])
// // @ts-ignore
// p3.then((res,rej)=>{
//   console.log(res);  
// })
export default Promise2