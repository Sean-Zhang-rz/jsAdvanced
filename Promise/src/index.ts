class Promise2 {
  constructor(fn) {
    if (typeof fn !== 'function') {
      throw new Error('Promise必须传入一个函数');
    }
    fn(
      () => {},
      () => {}
    );
  }
  then() {}
}
export default Promise2;
