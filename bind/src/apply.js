// es5版
const _apply = function (ctx, params) {
  let _this = ctx;
  if (!ctx) {
    _this = typeof window === 'undefined' ? global : window;
  }
  _this.fn = this;
  const args = [];
  if (params instanceof Array) {
    for (let i = 0, len = params.length; i < len; i++) {
      args.push(`params[${i}]`);
    }
  }
  const res = `_this.fn(${args})`;
  const result = eval(res);
  delete _this.fn;
  return result;
};
export default _apply;
