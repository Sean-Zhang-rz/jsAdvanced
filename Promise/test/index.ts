import * as chai from 'chai';
import Promise2 from '../src';
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
    let called = false;
    const promise = new Promise2(() => {
      called = true;
    });
    // @ts-ignore
    assert(called === true);
  });
  it('fn接受res和rej两个函数做参数', () => {
    let called = false;
    const promise = new Promise2((res, rej) => {
      called = true;
      assert.isFunction(res);
      assert.isFunction(rej);
    });
    // @ts-ignore
    assert(called === true);
  });
  it('promise.then(success)中的success会在res被调用的时候执行', () => {
    let called = false;
    const promise = new Promise2((res, rej) => {
      // @ts-ignore
      assert(called === false);
      res();
      // @ts-ignore
      assert(called === true);
    });
    // @ts-ignore
    promise.then(() => {
      called = true;
    });
  });
});
