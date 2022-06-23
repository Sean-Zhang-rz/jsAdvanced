class Promise2 {
  constructor(func) {
    this.PromiseState = 'pending'
    this.PromiseResult = null
    this.onFulfilledCallbacks = []
    this.onRejectedCallbacks = []
    if (typeof func !== 'function') throw new Error('Promise必须传入一个函数');
    try {
      func(this.resolve.bind(this), this.reject.bind(this));
    } catch (error) {
      this.reject.call(this, error)
    }
  }

  resolve(result) {
    if (this.PromiseState === 'pending') {
      nextTick(() => {
        this.PromiseState = 'fullfilled';
        this.PromiseResult = result;
        if (this.onFulfilledCallbacks.length) {
          this.onFulfilledCallbacks.forEach(callback => {
            callback(result)
          })
        }
      });
    }
  }

  reject(reason) {
    if (this.PromiseState === 'pending') {
      nextTick(() => {
        this.PromiseState = 'rejected';
        this.PromiseResult = reason;
        if (this.onRejectedCallbacks.length) {
          this.onRejectedCallbacks.forEach(callback => {
            callback(reason)
          })
        }
      });
    }
  }
 
  then(onFulfilled, onRejected) {
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value;
    onRejected = typeof onRejected === 'function' ? onRejected : reason => {
      throw reason;
    };

    let promise2 = new Promise2((resolve, reject) => {
      if (this.PromiseState === 'fullfilled') {
        console.log('--------fullfilled');
        nextTick(() => {
          try {
            let x = onFulfilled(this.PromiseResult);
            resolvePromise(promise2, x, resolve, reject);
          } catch (e) {
            reject(e);
          }
        });
      } else if (this.PromiseState === 'rejected') {
        console.log('--------rejected');
        nextTick(() => {
          try {
            let x = onRejected(this.PromiseResult);
            resolvePromise(promise2, x, resolve, reject);
          } catch (e) {
            reject(e)
          }
        });
      } else if (this.PromiseState === 'pending') {
        console.log('---------pending');
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
  catch(onRejected) {
    this.then(null, onRejected)
  }
}

function resolvePromise(promise2, x, resolve, reject) {
  if (x === promise2) return reject(new TypeError('Chaining cycle detected for promise'));

  if (x instanceof Promise2) {
    if (x.PromiseState === 'pending') {
      x.then(y => {
        resolvePromise(promise2, y, resolve, reject)
      }, reject);
    } else if (x.PromiseState === 'fullfilled') {
      console.log('fullfilled');
      resolve(x.PromiseResult);
    } else if (x.PromiseState === 'rejected') {
      console.log('rejetced');
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

// const p1 = new Promise2((res,rej) => {
//   rej(Promise.resolve('ok'))
// })
// p1.then(res => {
//   console.log(res);
// }, rej => {
//   console.log(rej);
// })
const p2 = new Promise2((res)=>{
  res('ok')
})
p2.then(res=>{
  console.log(res);
  return 'ok2'
}).then(res=>{
  console.log(res);
}, rej=>{
  console.log(rej);
})
Promise2.deferred = function () {
  let result = {};
  result.promise = new Promise2((resolve, reject) => {
    result.resolve = resolve;
    result.reject = reject;
  });
  return result;
}
module.exports = Promise2;