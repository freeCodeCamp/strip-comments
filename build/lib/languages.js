'use strict';
var __assign =
  (this && this.__assign) ||
  function () {
    __assign =
      Object.assign ||
      function (t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s)
            if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
      };
    return __assign.apply(this, arguments);
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.sql =
  exports.ocaml =
  exports.pascal =
  exports.sass =
  exports.typscript =
  exports.ts =
  exports.swift =
  exports.less =
  exports.js =
  exports.java =
  exports.css =
  exports.c =
  exports.shebang =
  exports.hashbang =
  exports.ruby =
  exports.python =
  exports.php =
  exports.perl =
  exports.matlab =
  exports.lua =
  exports.javascript =
  exports.haskell =
  exports.csharp =
  exports.applescript =
  exports.apl =
  exports.ada =
    void 0;
exports.ada = { LINE_REGEX: /^--.*/ };
exports.apl = { LINE_REGEX: /^⍝.*/ };
exports.applescript = {
  BLOCK_OPEN_REGEX: /^\(\*/,
  BLOCK_CLOSE_REGEX: /^\*\)/,
};
exports.csharp = {
  LINE_REGEX: /^\/\/.*/,
};
exports.haskell = {
  BLOCK_OPEN_REGEX: /^\{-/,
  BLOCK_CLOSE_REGEX: /^-\}/,
  LINE_REGEX: /^--.*/,
};
/**
 * As of yet, Safari does not support lookbehind https://caniuse.com/?search=lookbehind
 * https://bugs.webkit.org/show_bug.cgi?id=174931

exports.html = {
  BLOCK_OPEN_REGEX: /^\n*<!--(?!-?>)/,
  BLOCK_CLOSE_REGEX: /^(?<!(?:<!-))-->/,
  BLOCK_CLOSE_LOOSE_REGEX: /^(?<!(?:<!-))--\s*>/,
  BLOCK_CLOSE_STRICT_NEWLINE_REGEX: /^(?<!(?:<!-))-->(\s*\n+|\n*)/,
  BLOCK_CLOSE_STRICT_LOOSE_REGEX: /^(?<!(?:<!-))--\s*>(\s*\n+|\n*)/,
};
*/
exports.javascript = {
  BLOCK_OPEN_REGEX: /^\/\*\*?(!?)/,
  BLOCK_CLOSE_REGEX: /^\*\/(\n?)/,
  LINE_REGEX: /^\/\/(!?).*/,
};
exports.lua = {
  BLOCK_OPEN_REGEX: /^--\[\[/,
  BLOCK_CLOSE_REGEX: /^\]\]/,
  LINE_REGEX: /^--.*/,
};
exports.matlab = {
  BLOCK_OPEN_REGEX: /^%{/,
  BLOCK_CLOSE_REGEX: /^%}/,
  LINE_REGEX: /^%.*/,
};
exports.perl = {
  LINE_REGEX: /^#.*/,
};
exports.php = __assign(__assign({}, exports.javascript), {
  LINE_REGEX: /^(#|\/\/).*?(?=\?>|\n)/,
});
exports.python = {
  BLOCK_OPEN_REGEX: /^"""/,
  BLOCK_CLOSE_REGEX: /^"""/,
  LINE_REGEX: /^#.*/,
};
exports.ruby = {
  BLOCK_OPEN_REGEX: /^=begin/,
  BLOCK_CLOSE_REGEX: /^=end/,
  LINE_REGEX: /^#.*/,
};
exports.hashbang = {
  LINE_REGEX: /^#!.*/,
};
exports.shebang = exports.hashbang;
exports.c = exports.javascript;
exports.css = exports.javascript;
exports.java = exports.javascript;
exports.js = exports.javascript;
exports.less = exports.javascript;
exports.swift = exports.javascript;
exports.ts = exports.javascript;
exports.typscript = exports.javascript;
exports.sass = exports.javascript;
exports.pascal = exports.applescript;
exports.ocaml = exports.applescript;
exports.sql = exports.ada;
