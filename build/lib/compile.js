'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.default = function (cst, options) {
  var keepProtected = options.safe === true || options.keepProtected === true;
  var firstSeen = false;
  var walk = function (node) {
    var output = '';
    var inner;
    var lines;
    for (var _i = 0, _a = node.nodes; _i < _a.length; _i++) {
      var child = _a[_i];
      switch (child.type) {
        case 'block':
          if (options.first && firstSeen === true) {
            output += walk(child);
            break;
          }
          if (options.preserveNewlines === true) {
            inner = walk(child);
            lines = inner.split('\n');
            output += '\n'.repeat(lines.length - 1);
            break;
          }
          if (keepProtected === true && child.protected === true) {
            output += walk(child);
            break;
          }
          firstSeen = true;
          break;
        case 'line':
          if (options.first && firstSeen === true) {
            output += child.value;
            break;
          }
          if (keepProtected === true && child.protected === true) {
            output += child.value;
          }
          firstSeen = true;
          break;
        case 'open':
        case 'close':
        case 'text':
        case 'newline':
        default: {
          output += child.value || '';
          break;
        }
      }
    }
    return output;
  };
  return walk(cst);
};
