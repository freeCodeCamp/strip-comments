'use strict';
var __extends =
  (this && this.__extends) ||
  (function () {
    var extendStatics = function (d, b) {
      extendStatics =
        Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array &&
          function (d, b) {
            d.__proto__ = b;
          }) ||
        function (d, b) {
          for (var p in b)
            if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
        };
      return extendStatics(d, b);
    };
    return function (d, b) {
      if (typeof b !== 'function' && b !== null)
        throw new TypeError(
          'Class extends value ' + String(b) + ' is not a constructor or null'
        );
      extendStatics(d, b);
      function __() {
        this.constructor = d;
      }
      d.prototype =
        b === null
          ? Object.create(b)
          : ((__.prototype = b.prototype), new __());
    };
  })();
Object.defineProperty(exports, '__esModule', { value: true });
exports.Block = exports.TextNode = void 0;
var TextNode = /** @class */ (function () {
  function TextNode(node) {
    this.type = node.type;
    if (node.value) this.value = node.value;
    if (node.match) this.match = node.match;
    this.newline = node.newline || '';
  }
  Object.defineProperty(TextNode.prototype, 'protected', {
    get: function () {
      return Boolean(this.match) && this.match[1] === '!';
    },
    enumerable: false,
    configurable: true,
  });
  return TextNode;
})();
exports.TextNode = TextNode;
var Block = /** @class */ (function (_super) {
  __extends(Block, _super);
  function Block(node) {
    var _this = _super.call(this, node) || this;
    _this.nodes = node.nodes || [];
    return _this;
  }
  Block.prototype.push = function (node) {
    this.nodes.push(node);
  };
  Object.defineProperty(Block.prototype, 'protected', {
    get: function () {
      return this.nodes.length > 0 && this.nodes[0].protected === true;
    },
    enumerable: false,
    configurable: true,
  });
  return Block;
})(TextNode);
exports.Block = Block;
