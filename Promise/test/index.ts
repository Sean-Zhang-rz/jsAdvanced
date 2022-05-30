import * as chai from 'chai';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import Promise2 from '../src';

chai.use(sinonChai);
const assert = chai.assert;

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
    let fn = sinon.fake();
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
});
