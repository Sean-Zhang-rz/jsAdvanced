class Promise2 {
  succeed = null;
  fail = null;
  state = 'pending';
  res() {
    setTimeout(() => {
      this.succeed();
    }, 0);
  }
  rej() {
    setTimeout(() => {
      this.fail();
    }, 0);
  }
  constructor(fn) {
    if (typeof fn !== 'function') {
      throw new Error('Promise必须传入一个函数');
    }
    fn(this.res.bind(this), this.rej.bind(this));
  }
  then(succeed?, fail?) {
    this.succeed = succeed;
    this.fail = fail;
  }
}
export default Promise2;
