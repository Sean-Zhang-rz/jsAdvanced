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
    if (this.PromiseState === 'pending') {
      nextTick(() => {
        this.PromiseState = 'fullfilled';
        this.PromiseResult = result;     
        if (this.onFulfilledCallbacks?.length) {
          this.onFulfilledCallbacks.forEach(callback => {
            // console.log('result',result);
            // console.log('callback', callback);
            
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
        if (this.onRejectedCallbacks?.length) {
          this.onRejectedCallbacks.forEach(callback => {
            callback(reason)
          })
        }
      });
    }
  }
  
  then(onFulfilled?, onRejected?) {
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value;
    onRejected = typeof onRejected === 'function' ? onRejected : reason => {
      throw reason;
    };

    let promise2 = new Promise2((resolve, reject) => {
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
  catch(onRejected) {
    this.then(null, onRejected)
  }
  finally(cb){
    this.then(cb, cb)
  }
  static resolve(result) {
    if (result instanceof Promise2) {
      return result
    } else if (result instanceof Object && 'then' in result) {
      return new Promise2((res, rej) => {
        result.then(res, rej)
      })
    }else {
      return new Promise2((res) => {
        res(result)
      })
    }
  }
  static reject(reason) {
    return new Promise2((res, rej)=>{
      rej(reason)
    })
  }
  static all(promises) {
    if (!(promises instanceof Array)) throw TypeError('Argument is not iterable')
    if (!promises.length) return Promise2.resolve(promises)
    return new Promise2((resolve, reject)=>{
      const result = []
      let count = 0
      promises.forEach((p, index) => {
        Promise2.resolve(p).then((res) => {
          result[index] = res
          count += 1
          if (count === promises.length) resolve(result)
        }, (rej) => {
          reject(rej)
        })
      })
    })
  }
  static allSettled(promises) {
    if (!(promises instanceof Array)) throw TypeError('Argument is not iterable')
    if (!promises.length) return Promise2.resolve(promises)
    return new Promise2((resolve, reject) => {
      const result = []
      let count = 0
      promises.forEach((p, index) => {
        Promise2.resolve(p).then((res) => {
          const obj = {
            status:'fullfilled',
            value: res
          }
          result[index] = obj
          count += 1
          if (count === promises.length) resolve(result)
        }, (rej) => {
          const obj = {
            status: 'rejected',
            value: rej
          }
          result[index] = obj
          count += 1
          if (count === promises.length) resolve(result)
        })
      })
    })
  }
  static any(promises) {
    if (!(promises instanceof Array)) throw TypeError('Argument is not iterable')
    if (!promises.length) return Promise2.reject('All promises were rejected')
    return new Promise2((resolve, reject) => {
      const error = []
      let count = 0
      promises.forEach((p, index) => {
        Promise2.resolve(p).then((res) => {
          resolve(res)
        }, (rej) => {
          count += 1
          error[index] = rej
          count += 1
          if (count === promises.length) reject('All promises were rejected')
        })
      })
    })
  }
  static race(promises) {
    if (!(promises instanceof Array)) throw TypeError('Argument is not iterable')
    if (!promises.length) return new Promise2(()=>{})
    return new Promise2((resolve, reject) => {
      promises.forEach(p => {
        Promise2.resolve(p).then(resolve, reject)
      })
    })
  }
}

function resolvePromise(promise2, x, resolve, reject) {
  if (x === promise2) {
    return reject(new TypeError('Chaining cycle detected for promise'));
  }

  if (x instanceof Promise2) {
    if (x.PromiseState === 'pending') {
      console.log('pending');
      
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
const p1 = new Promise2((res)=>{
  res(1)
})
const p2 = new Promise2((res,rej)=>{
  rej(2) 
})
const p3 = new Promise2((res)=>{
  res(3)
})
Promise2.allSettled([p1,p2,p3]).then(res=>{
  console.log(res);
  
},(rej)=>{
  console.log(rej);
  
})
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
module.exports = Promise2;