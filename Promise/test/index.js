import * as chai from 'chai';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
// import Promise2 from '../src/index2';
const Promise2 = require('../demo');

chai.use(sinonChai);
const { assert } = chai;

describe('Promise', () => {
  it('是一个类', () => {
    assert.isFunction(Promise2);
    assert.isObject(Promise2.prototype);
  });
  it('new Promise() 必须接受一个函数', () => {
    assert.throw(() => {
      // @ts-ignore
      new Promise2();
    });
    assert.throw(() => {
      // @ts-ignore
      new Promise2(1);
    });
    assert.throw(() => {
      // @ts-ignore
      new Promise2(false);
    });
  });
  it('new Promise(fn)会生成一个对象，有then方法', () => {
    const promise = new Promise2(() => {});
    assert.isFunction(promise.then);
  });
  it('fn立刻执行', () => {
    const fn = sinon.fake();
    new Promise2(fn);
    assert.isTrue(fn.called);
  });
  it('fn接受res和rej两个函数做参数', (done) => {
    const promise = new Promise2((res, rej) => {
      assert.isFunction(res);
      assert.isFunction(rej);
      done();
    });
  });
  it('promise.then(success)中的success会在res被调用的时候执行', (done) => {
    const success = sinon.fake();
    const promise = new Promise2((res, rej) => {
      assert.isFalse(success.called);
      res();
      setTimeout(() => {
        assert.isTrue(success.called);
        done();
      });
    });
    promise.then(success);
  });
  it('promise.then(null, fail)中的fail会在rej被调用的时候执行', (done) => {
    const fail = sinon.fake();
    const promise = new Promise2((res, rej) => {
      assert.isFalse(fail.called);
      rej();
      setTimeout(() => {
        assert.isTrue(fail.called);
        done();
      });
    });
    promise.then(null, fail);
  });
  it('promise.then(success,fail)中的success,fail是函数', (done) => {
    const promise = new Promise2((res, rej) => {
      res();
    });
    promise.then(false, null);
    done();
  });
  it('promise success后状态变成fullfilled', (done) => {
    const succeed = sinon.fake();
    const promise = new Promise2((res, rej) => {
      // assert.isTrue(promise.state === 'pending');
      assert.isFalse(succeed.called);
      res(233);
      setTimeout(() => {
        assert.isTrue(promise.state === 'fullfilled');
        assert.isTrue(succeed.called);
        assert.isTrue(succeed.calledWith(233));
        done();
      }, 0);
    });
    promise.then(succeed);
  });
  xit('res或者rej只能被调用一次', (done) => {
    const succeed = sinon.fake();
    const promise = new Promise2((res, rej) => {
      assert.isFalse(succeed.called);
      res(233);
      res(234444);
      setTimeout(() => {
        assert.isTrue(promise.state === 'fullfilled');
        assert.isTrue(succeed.calledOnce);
        assert.isTrue(succeed.calledWith(233));
        done();
      }, 0);
    });
    promise.then(succeed);
  });
  xit('rej也适用', (done) => {
    const fail = sinon.fake();
    const promise = new Promise2((res, rej) => {
      assert.isFalse(fail.called);
      rej('失败了');
      rej('又失败了');
      setTimeout(() => {
        assert.isTrue(promise.state === 'rejected');
        assert.isTrue(fail.calledOnce);
        assert.isTrue(fail.calledWith('失败了'));
        done();
      }, 0);
    });
    promise.then(null, fail);
  });
  xit('在执行上下文堆栈仅包含平台代码前（在我的代码执行完前），不得调用then的两个参数', (done) => {
    const success = sinon.fake();
    const promise = new Promise2((res, rej) => {
      res();
    });
    promise.then(success, null);
    console.log(1);
    assert.isFalse(success.called);
    setTimeout(() => {
      assert.isTrue(success.called);
      done();
    }, 0);
  });
  xit('2.2.5 with no this value', (done) => {
    const promise = new Promise2((res, rej) => {
      res();
    });
    promise.then(function () {
      assert.isTrue(this === undefined);
      done();
    });
  });
  it('then可以被多次调用', (done) => {
    const fn1 = sinon.fake();
    const fn2 = sinon.fake();
    const fn3 = sinon.fake();
    const promise = new Promise2((res, rej) => {
      res();
    });
    promise.then(fn1);
    promise.then(fn2);
    promise.then(fn3);
    setTimeout(() => {
      assert.isTrue(fn1.called);
      assert.isTrue(fn2.called);
      assert.isTrue(fn3.called);
      assert.isTrue(fn2.calledAfter(fn1));
      assert.isTrue(fn3.calledAfter(fn2));
      done();
    }, 0);
  });
  it('then可以被多次调用rej', (done) => {
    const fn1 = sinon.fake();
    const fn2 = sinon.fake();
    const fn3 = sinon.fake();
    const promise = new Promise2((res, rej) => {
      rej();
    });
    promise.then(null, fn1);
    promise.then(null, fn2);
    promise.then(null, fn3);
    setTimeout(() => {
      assert.isTrue(fn1.called);
      assert.isTrue(fn2.called);
      assert.isTrue(fn3.called);
      assert.isTrue(fn2.calledAfter(fn1));
      assert.isTrue(fn3.calledAfter(fn2));
      done();
    }, 0);
  });
  it('then必须返回一个promise', (done) => {
    const promise = new Promise2((res, rej) => {
      res();
    });
    const promise2 = promise.then(
      () => {},
      () => {}
    );
    assert.isTrue(promise2 instanceof Promise2);
    done();
  });
  it('then(success, fail)中的success返回一个值x，之后的promise接收其成功或者失败值', (done) => {
    const fn2 = (res) => {
      assert.equal(res, '成功');
      done();
    };
    const promise = new Promise2((res, rej) => {
      res();
    });
    const promise2 = promise
      .then(
        () => '成功',
        () => {}
      )
      .then(fn2);
  });
  it('fn过程中失败', (done) => {
    const promise = new Promise2((res, rej) => {
      throw new Error('123');
      res();
    });
    promise.then(
      () => '成功',
      (e) => {
        console.log(e);
      }
    );
    done();
  });
  it('then里面的两个函数是微任务', (done) => {
    const fn1 = sinon.fake();
    const fn2 = sinon.fake();
    const promise = new Promise2((res, rej) => {
      res();
    });
    setTimeout(() => {
      fn1();
      assert.isTrue(fn2.called);
    }, 0);
    promise.then(() => {
      fn2();
      assert.isFalse(fn1.called);
    });
    done();
  });
  it('then后面的then接收前面then成功或者失败的返回值', (done) => {
    const fn1 = sinon.fake();
    const promise = new Promise2((res, rej) => {
      res('成功');
    });
    const promise2 = promise.then(fn1, null);
    setTimeout(() => {
      assert.isTrue(fn1.called);
      assert.isTrue(fn1.calledWith('成功'));
      done();
    }, 0);
  });
});
