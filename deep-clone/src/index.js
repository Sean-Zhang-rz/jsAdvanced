class DeepClone {
  constructor() {
    this.cache = [];
  }
  clone(source) {
    if (source instanceof Object) {
      const cacheDist = this.findCache(source);
      if (cacheDist) {
        return cacheDist;
      } else {
        let dist;
        if (source instanceof Array) {
          // eslint-disable-next-line no-array-constructor
          dist = new Array();
        } else if (source instanceof RegExp) {
          dist = new RegExp(source.source, source.flags);
        } else if (source instanceof Date) {
          dist = new Date(source);
        } else if (source instanceof Function) {
          dist = function () {
            return source.apply(this, arguments);
          };
        } else {
          // eslint-disable-next-line no-new-object
          dist = new Object();
        }
        this.cache.push([source, dist]);
        for (let k in source) {
          if (source.hasOwnProperty(k)) {
            dist[k] = this.clone(source[k]);
          }
        }
        return dist;
      }
    }
    return source;
  }
  findCache(source) {
    for (let i = 0; i < this.cache.length; i++) {
      if (this.cache[i][0] === source) {
        return this.cache[i][1];
      }
    }
    return undefined;
  }
}
module.exports = DeepClone;
