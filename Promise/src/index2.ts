type Status = 'pending' | 'fullfilled' | 'rejected';

class Promise2 {
  PromiseState: Status = 'pending'
  PromiseResult: unknown = null
  onFulfilledCallbacks = []
  onRejectedCallbacks = []

  constructor(func: (resolve: (result: unknown) => void, reject: (reason?: any) => void) => void) {
    if (typeof func !== 'function') throw new Error('Promise必须传入一个函数');
    try {
      func(this.resolve.bind(this), this.reject.bind(this));
    } catch (error) {
      this.reject.call(this, error)
    }
  }

  resolve(result) {
    console.log('resolve');
    
    if (this.PromiseState === 'pending') {
      nextTick(() => {
        this.PromiseState = 'fullfilled';
        this.PromiseResult = result;        
        this.onFulfilledCallbacks.forEach(callback => {
          callback(result)
        })
      });
    }
  }

  reject(reason) {
    if (this.PromiseState === 'pending') {
      nextTick(() => {
        this.PromiseState = 'rejected';
        this.PromiseResult = reason;
        this.onRejectedCallbacks.forEach(callback => {
          callback(reason)
        })
      });
    }
  }

  /**
   * [注册fulfilled状态/rejected状态对应的回调函数] 
   * @param {function} onFulfilled  fulfilled状态时 执行的函数
   * @param {function} onRejected  rejected状态时 执行的函数 
   * @returns {function} newPromsie  返回一个新的promise对象
   */
  then(onFulfilled?, onRejected?) {
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value;
    onRejected = typeof onRejected === 'function' ? onRejected : reason => {
      throw reason;
    };

    let promise2 = new Promise2((resolve, reject) => {
      console.log(this.PromiseState);
      if (this.PromiseState === 'fullfilled') {
        nextTick(() => {
          try {
            let x = onFulfilled(this.PromiseResult);
            resolvePromise(promise2, x, resolve, reject);
          } catch (e) {
            reject(e);
          }
        });
      } else if (this.PromiseState === 'rejected') {
        nextTick(() => {
          try {
            let x = onRejected(this.PromiseResult);
            resolvePromise(promise2, x, resolve, reject);
          } catch (e) {
            reject(e)
          }
        });
      } else if (this.PromiseState === 'pending') {
        this.onFulfilledCallbacks.push(() => {
          try {
            let x = onFulfilled(this.PromiseResult);
            resolvePromise(promise2, x, resolve, reject)
          } catch (e) {
            reject(e);
          }
        });
        this.onRejectedCallbacks.push(() => {
          try {
            let x = onRejected(this.PromiseResult);
            resolvePromise(promise2, x, resolve, reject);
          } catch (e) {
            reject(e);
          }
        });
      }
    })

    return promise2
  }
}

/**
 * 对resolve()、reject() 进行改造增强 针对resolve()和reject()中不同值情况 进行处理
 * @param  {promise} promise2 promise1.then方法返回的新的promise对象
 * @param  {[type]} x         promise1中onFulfilled或onRejected的返回值
 * @param  {[type]} resolve   promise2的resolve方法
 * @param  {[type]} reject    promise2的reject方法
 */
function resolvePromise(promise2, x, resolve, reject) {
  if (x === promise2) {
    return reject(new TypeError('Chaining cycle detected for promise'));
  }

  if (x instanceof Promise2) {
    if (x.PromiseState === 'pending') {
      x.then(y => {
        resolvePromise(promise2, y, resolve, reject)
      }, reject);
    } else if (x.PromiseState === 'fullfilled') {
      resolve(x.PromiseResult);
    } else if (x.PromiseState === 'rejected') {
      reject(x.PromiseResult);
    }
  } else if (x !== null && ((typeof x === 'object' || (typeof x === 'function')))) {
    try {
      var then = x.then;
    } catch (e) {
      return reject(e);
    }

    if (typeof then === 'function') {
      let called = false;
      try {
        then.call(
          x,
          y => {
            if (called) return;
            called = true;
            resolvePromise(promise2, y, resolve, reject);
          },
          r => {
            if (called) return;
            called = true;
            reject(r);
          }
        )
      } catch (e) {
        if (called) return;
        called = true;

        reject(e);
      }
    } else {
      resolve(x);
    }
  } else {
    return resolve(x);
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
// @ts-ignore
Promise2.deferred = function () {
  let result = {};
  // @ts-ignore
  result.promise = new Promise2((resolve, reject) => {
    // @ts-ignore
    result.resolve = resolve;
    // @ts-ignore
    result.reject = reject;
  });
  return result;
}
const p1 = new Promise2((res,rej)=>{
  res('ok')
})
p1.then(res=>{
  console.log(res);
  
})
module.exports = Promise2;