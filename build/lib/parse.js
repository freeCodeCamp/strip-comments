'use strict';
var __createBinding =
  (this && this.__createBinding) ||
  (Object.create
    ? function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        var desc = Object.getOwnPropertyDescriptor(m, k);
        if (
          !desc ||
          ('get' in desc ? !m.__esModule : desc.writable || desc.configurable)
        ) {
          desc = {
            enumerable: true,
            get: function () {
              return m[k];
            },
          };
        }
        Object.defineProperty(o, k2, desc);
      }
    : function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        o[k2] = m[k];
      });
var __setModuleDefault =
  (this && this.__setModuleDefault) ||
  (Object.create
    ? function (o, v) {
        Object.defineProperty(o, 'default', { enumerable: true, value: v });
      }
    : function (o, v) {
        o['default'] = v;
      });
var __importStar =
  (this && this.__importStar) ||
  function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null)
      for (var k in mod)
        if (k !== 'default' && Object.prototype.hasOwnProperty.call(mod, k))
          __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
  };
Object.defineProperty(exports, '__esModule', { value: true });
var Node_1 = require('./Node');
var languages = __importStar(require('./languages'));
var constants = {
  ESCAPED_CHAR_REGEX: /^\\./,
  QUOTED_STRING_REGEX: /^(['"`])((?:\\\1|[^\1])*?)(\1)/,
  NEWLINE_REGEX: /^\r*\n/,
};
var parse = function (input, options) {
  if (typeof input !== 'string') {
    throw new TypeError('Expected input to be a string');
  }
  var cst = new Node_1.Block({ type: 'root', nodes: [] });
  var stack = [cst];
  var name = (options.language || 'javascript').toLowerCase();
  var lang = languages[name];
  if (typeof lang === 'undefined') {
    throw new Error(
      'Language "'.concat(name, '" is not supported by strip-comments')
    );
  }
  var LINE_REGEX = lang.LINE_REGEX,
    BLOCK_OPEN_REGEX = lang.BLOCK_OPEN_REGEX,
    BLOCK_CLOSE_REGEX = lang.BLOCK_CLOSE_REGEX;
  var block = cst;
  var remaining = input;
  var token;
  var prev;
  var source = [BLOCK_OPEN_REGEX, BLOCK_CLOSE_REGEX].filter(Boolean);
  var tripleQuotes = false;
  if (
    source.every(function (regex) {
      return regex.source === '^"""';
    })
  ) {
    tripleQuotes = true;
  }
  /**
   * Helpers
   */
  var consume = function (value) {
    if (value === void 0) {
      value = remaining[0] || '';
    }
    remaining = remaining.slice(value.length);
    return value;
  };
  var scan = function (regex, type) {
    if (type === void 0) {
      type = 'text';
    }
    var match = regex.exec(remaining);
    if (match) {
      consume(match[0]);
      return { type: type, value: match[0], match: match };
    }
  };
  var push = function (node) {
    if (prev && prev.type === 'text' && node.type === 'text') {
      prev.value += node.value;
      return;
    }
    block.push(node);
    if (node instanceof Node_1.Block) {
      if (node.nodes) {
        stack.push(node);
        block = node;
      }
    }
    prev = node;
  };
  var pop = function () {
    if (block.type === 'root') {
      throw new SyntaxError('Unclosed block comment');
    }
    stack.pop();
    block = stack[stack.length - 1];
  };
  /**
   * Parse input string
   */
  while (remaining !== '') {
    // escaped characters
    if ((token = scan(constants.ESCAPED_CHAR_REGEX, 'text'))) {
      push(new Node_1.TextNode(token));
      continue;
    }
    // quoted strings
    if (
      block.type !== 'block' &&
      (!prev || !/\w$/.test(prev.value)) &&
      !(tripleQuotes && remaining.startsWith('"""'))
    ) {
      if ((token = scan(constants.QUOTED_STRING_REGEX, 'text'))) {
        push(new Node_1.TextNode(token));
        continue;
      }
    }
    // newlines
    if ((token = scan(constants.NEWLINE_REGEX, 'newline'))) {
      push(new Node_1.TextNode(token));
      continue;
    }
    // block comment open
    if (
      BLOCK_OPEN_REGEX &&
      options.block &&
      !(tripleQuotes && block.type === 'block')
    ) {
      if ((token = scan(BLOCK_OPEN_REGEX, 'open'))) {
        push(new Node_1.Block({ type: 'block' }));
        push(new Node_1.TextNode(token));
        continue;
      }
    }
    // block comment close
    if (BLOCK_CLOSE_REGEX && block.type === 'block' && options.block) {
      if ((token = scan(BLOCK_CLOSE_REGEX, 'close'))) {
        token.newline = token.match[1] || '';
        push(new Node_1.TextNode(token));
        pop();
        continue;
      }
    }
    // line comment
    if (LINE_REGEX && block.type !== 'block' && options.line) {
      if ((token = scan(LINE_REGEX, 'line'))) {
        push(new Node_1.TextNode(token));
        continue;
      }
    }
    // Plain text (skip "C" since some languages use "C" to start comments)
    if ((token = scan(/^[a-zABD-Z0-9\t ]+/, 'text'))) {
      push(new Node_1.TextNode(token));
      continue;
    }
    push(new Node_1.TextNode({ type: 'text', value: consume(remaining[0]) }));
  }
  return cst;
};
exports.default = parse;
