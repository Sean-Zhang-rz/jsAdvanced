class Promise2 {
  succeed = null;
  fail = null;
  state = 'pending';

  res(result) {
    setTimeout(() => {
      this.state = 'fullfilled';

      if (this.succeed) this.succeed(result);
    }, 0);
  }
  rej(reason) {
    setTimeout(() => {
      this.state = 'rejected';
      if (this.fail) this.fail(reason);
    }, 0);
  }
  constructor(fn) {
    if (typeof fn !== 'function') {
      throw new Error('Promise必须传入一个函数');
    }
    fn(this.res.bind(this), this.rej.bind(this));
  }
  then(succeed?, fail?) {
    if (typeof succeed === 'function') this.succeed = succeed;
    if (typeof fail === 'function') this.fail = fail;
  }
}
export default Promise2;
