// es5版
const _call = function (ctx) {
  let _this = ctx;
  if (!ctx) {
    _this = typeof window === 'undefined' ? global : window;
  }
  _this.fn = this;
  const args = [];
  for (let i = 1, len = arguments.length; i < len; i++) {
    args.push(`arguments[${i}]`);
  }
  const res = `_this.fn(${args})`;
  const result = eval(res);
  delete _this.fn;
  return result;
};

export default _call;
