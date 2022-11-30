class DeepClone {
  constructor() {
    this.cache = [];
  }
  clone(source) {
    if (source instanceof Object) {
      const cache = this.findCache(source);
      if (cache) {
        return cache;
      } else {
        let dist;
        if (source instanceof Array) {
          dist = new Array();
        } else if (source instanceof Date) {
          dist = new Date(source);
        } else if (source instanceof Function) {
          dist = function () {
            return source.apply(this, arguments);
          };
        } else if (source instanceof RegExp) {
          dist = new RegExp(source.source, source.flags);
        } else {
          dist = new Object();
        }
        this.cache.push([source, dist]);
        for (let i in source) {
          if (source.hasOwnProperty(i)) {
            dist[i] = this.clone(dist[i]);
          }
        }
        return dist;
      }
    } else {
      return source;
    }
  }
  static findCache(source) {
    for (let i = 0; i < this.cache.length; i++) {
      if (this.cache[i][0] === source) {
        return this.cache[i][1];
      }
    }
    return false;
  }
}
export default new DeepClone();
