var depRelation = [{
      key: "index.js", 
      deps: ["a.js","b.js","../cssFile/style.css"],
      code: function(require, module, exports){
        "use strict";

var _a = _interopRequireDefault(require("./a.js"));

var _b = _interopRequireDefault(require("./b.js"));

require("../cssFile/style.css");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

console.log(_a["default"].value + _b["default"].value);
      }
    },{
      key: "a.js", 
      deps: [],
      code: function(require, module, exports){
        "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var a = {
  value: 1
};
var _default = a;
exports["default"] = _default;
      }
    },{
      key: "b.js", 
      deps: [],
      code: function(require, module, exports){
        "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var b = {
  value: 2
};
var _default = b;
exports["default"] = _default;
      }
    },{
      key: "../cssFile/style.css", 
      deps: [],
      code: function(require, module, exports){
        "use strict";

if (document) {
  var style = document.createElement('style');
  style.innerHTML = "\n  const str = \"body {\\n  color: red;\\n}\"\n  export default str\n";
  document.head.appendChild(style);
}
      }
    }];
var modules = {};
execute(depRelation[0].key)

  function execute(key) {
    if (modules[key]) { return modules[key] }
    var item = depRelation.find(i => i.key === key)
    if (!item) { throw new Error(`${item} is not found`) }
    var pathToKey = (path) => {
      var dirname = key.substring(0, key.lastIndexOf('/') + 1)
      var projectPath = (dirname + path).replace(/\.\//g, '').replace(/\/\//, '/')
      return projectPath
    }
    var require = (path) => {
      return execute(pathToKey(path))
    }
    modules[key] = { __esModule: true }
    var module = { exports: modules[key] }
    item.code(require, module, module.exports)
    return modules[key]
  }
  