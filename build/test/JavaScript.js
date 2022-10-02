/*!
 * strip-comments <https://github.com/jonschlinkert/strip-comments>
 *
 * Copyright (c) 2014-2018, Jon Schlinkert.
 * Released under the MIT license.
 */
'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
var fs_1 = __importDefault(require('fs'));
var path_1 = __importDefault(require('path'));
var assert_1 = __importDefault(require('assert'));
var index_1 = __importDefault(require('../index'));
var tests = path_1.default.join.bind(path_1.default, __dirname);
var read = function (src) {
  return fs_1.default.readFileSync(src, 'utf-8').replace(/\r*\n/g, '\n');
};
describe('JavaScript comments', function () {
  it('should strip all comments', function () {
    var actual = (0, index_1.default)(
      "'foo'; // this is a comment\n/* me too */ var abc = 'xyz';"
    );
    assert_1.default.strictEqual(actual, "'foo'; \n var abc = 'xyz';");
  });
  it('should work on unclosed (invalid) blocks', function () {
    var actual = (0, index_1.default)("'foo'; /* I am invalid ");
    assert_1.default.strictEqual(actual, "'foo'; ");
  });
  it('should strip line comments', function () {
    var actual = index_1.default.line('foo // this is a comment\n/* me too */');
    var expected = 'foo \n/* me too */';
    assert_1.default.strictEqual(actual, expected);
  });
  it('should not mistake escaped slashes for comments', function () {
    // see https://github.com/jonschlinkert/extract-comments/issues/12
    var expected = "'foo/bar'.replace(/o\\//, 'g')";
    var actual = index_1.default.line(expected);
    assert_1.default.deepEqual(actual, expected);
  });
  it('should strip block comments', function () {
    var actual = index_1.default.block(
      'foo // this is a comment\n/* me too */'
    );
    var expected = 'foo // this is a comment\n';
    assert_1.default.strictEqual(actual, expected);
  });
  // see https://github.com/jonschlinkert/strip-comments/issues/31
  it('should only strip the first comment', function () {
    var expected = read(tests('expected/banner.js'));
    var fixture = read(tests('fixtures/banner.js'));
    var actual = index_1.default.first(fixture);
    assert_1.default.strictEqual(actual, expected);
  });
  // see https://github.com/jonschlinkert/strip-comments/issues/31
  it('should strip the first non-protected comment', function () {
    var expected = read(tests('expected/banner-protected.js'));
    var fixture = read(tests('fixtures/banner.js'));
    var actual = index_1.default.first(fixture, { keepProtected: true });
    assert_1.default.strictEqual(actual, expected);
  });
  // see https://github.com/jonschlinkert/strip-comments/issues/21
  it('should not strip non-comments in quoted strings 2', function () {
    var expected = read(tests('fixtures/quoted-strings.js'));
    var actual = (0, index_1.default)(expected);
    assert_1.default.equal(actual, expected);
  });
  // see https://github.com/jonschlinkert/strip-comments/issues/18
  it('should not hang on unclosed comments', function () {
    var expected = "if (accept == 'video/*') {";
    var actual = (0, index_1.default)(expected);
    // fails because using `esprima` under the hood
    assert_1.default.equal(actual, expected);
  });
  it('should not mangle json', function () {
    var expected = read(path_1.default.join(__dirname, '..', 'package.json'));
    var before = JSON.parse(expected);
    var res = (0, index_1.default)(expected);
    var after = JSON.parse(res);
    assert_1.default.deepEqual(before, after);
  });
  it('should strip all but not `/*/`', function () {
    var actual = (0, index_1.default)(
      "/* I will be stripped */\nvar path = '/this/should/*/not/be/stripped';"
    );
    var expected = "var path = '/this/should/*/not/be/stripped';";
    assert_1.default.strictEqual(actual, expected);
  });
  it('should strip all but not globstars `/**/*` #1', function () {
    var actual = (0, index_1.default)(
      "var path = './do/not/strip/globs/**/*.js';"
    );
    var expected = "var path = './do/not/strip/globs/**/*.js';";
    assert_1.default.strictEqual(actual, expected);
  });
  it('should strip all but not globstars `/**/` #2 and `//!` line comments (safe: true)', function () {
    var actual = (0, index_1.default)(
      "var partPath = './path/*/to/scripts/**/'; //! line comment",
      { safe: true }
    );
    var expected = "var partPath = './path/*/to/scripts/**/'; //! line comment";
    assert_1.default.strictEqual(actual, expected);
  });
  it('should strip all but not `/*/*something` from anywhere', function () {
    var actual = (0, index_1.default)(
      "var partPath = './path/*/*something/test.txt';"
    );
    var expected = "var partPath = './path/*/*something/test.txt';";
    assert_1.default.strictEqual(actual, expected);
  });
  it('should strip all but not `/*/*something/*.js` from anywhere (globstar-like)', function () {
    var actual = (0, index_1.default)(
      "var partPath = './path/*/*something/*.js';"
    );
    var expected = "var partPath = './path/*/*something/*.js';";
    assert_1.default.strictEqual(actual, expected);
  });
  it('should leave alone code without any comments', function () {
    var fixture = read(tests('fixtures/no-comment.js'));
    var actual = (0, index_1.default)(fixture);
    var expected = fixture;
    assert_1.default.strictEqual(actual, expected);
  });
  // see https://github.com/jonschlinkert/strip-comments/issues/27
  it('should not break on comments that are substrings of a later comment', function () {
    var actual = (0, index_1.default)(
      [
        '// this is a substring',
        '// this is a substring of a larger comment',
        'someCode();',
        'someMoreCode();',
      ].join('\n')
    );
    var expected = ['', '', 'someCode();', 'someMoreCode();'].join('\n');
    assert_1.default.strictEqual(actual, expected);
  });
  it('should not break on comments that are in between empty strings', function () {
    var actual = (0, index_1.default)('""; // comment \n""');
    var expected = '""; \n""';
    assert_1.default.strictEqual(actual, expected);
  });
});
describe('error handling:', function () {
  it('should throw TypeError when a string is not passed', function () {
    var fixture = function () {
      return (0, index_1.default)(123);
    };
    assert_1.default.throws(fixture, TypeError);
    assert_1.default.throws(fixture, /expected input to be a string/i);
  });
  it('should throw TypeError when a string is not passed to `.block`', function () {
    var fixture = function () {
      return index_1.default.block(123);
    };
    assert_1.default.throws(fixture, TypeError);
    assert_1.default.throws(fixture, /expected input to be a string/i);
  });
  it('should throw TypeError when a string is not passed to `.line`', function () {
    var fixture = function () {
      return index_1.default.line(123);
    };
    assert_1.default.throws(fixture, TypeError);
    assert_1.default.throws(fixture, /expected input to be a string/i);
  });
  it('should not throw on empty string, returns empty string', function () {
    var actual = (0, index_1.default)('');
    var expected = '';
    assert_1.default.strictEqual(typeof actual, 'string');
    assert_1.default.strictEqual(
      actual,
      expected,
      'expect empty string on empty string passed'
    );
  });
});
describe('strip all or empty:', function () {
  it('should strip all multiline, singleline, block and line comments', function () {
    var fixture = read(tests('fixtures/strip-all.js'));
    var expected = read(tests('expected/strip-all.js'));
    var actual = (0, index_1.default)(fixture);
    assert_1.default.strictEqual(actual, expected);
  });
  it('should not strip !important block comments', function () {
    var fixture = read(tests('fixtures/strip-all.js'));
    var actual = index_1.default.block(fixture, { safe: true });
    var expected = read(tests('expected/strip-keep-block.js'));
    assert_1.default.strictEqual(actual, expected);
  });
  it('should strip only all line comments that not starts with `//!` (safe:true)', function () {
    var fixture = read(tests('fixtures/strip-keep-line.js'));
    var actual = index_1.default.line(fixture, { safe: true });
    var expected = read(tests('expected/strip-keep-line.js'));
    assert_1.default.strictEqual(actual, expected);
  });
});
describe('strip all keep newlines:', function () {
  it('should strip all comments, but keep newlines', function () {
    var fixture = read(tests('fixtures/strip-all.js'));
    var expected = read(tests('expected/strip-keep-newlines.js'));
    var actual = (0, index_1.default)(fixture, { preserveNewlines: true });
    assert_1.default.strictEqual(actual, expected);
  });
});
describe('block comments:', function () {
  it('should strip block comments from a function', function () {
    var actual = index_1.default.block(
      'var bar = function(/* this is a comment*/) {return;};'
    );
    var expected = 'var bar = function() {return;};';
    assert_1.default.strictEqual(actual, expected);
  });
  it('should strip block comments before and from a function', function () {
    var actual = index_1.default.block(
      '/* this is a comment */\nvar bar = function(/*this is a comment*/) {return;};'
    );
    var expected = 'var bar = function() {return;};';
    assert_1.default.strictEqual(actual, expected);
  });
  it('should strip block comments before, after and from a function', function () {
    var actual = index_1.default.block(
      '/* this is a comment */var bar = function(/*this is a comment*/) {return;};\n/* this is a comment*/'
    );
    var expected = 'var bar = function() {return;};\n';
    assert_1.default.strictEqual(actual, expected);
  });
});
describe('line comments:', function () {
  it('should strip line comments', function () {
    var actual = index_1.default.line(
      '// this is a line comment\nvar bar = function(/*this is a comment*/) {return;};'
    );
    var expected = '\nvar bar = function(/*this is a comment*/) {return;};';
    assert_1.default.strictEqual(actual, expected);
  });
  it('should strip line comments with leading whitespace', function () {
    var actual = index_1.default.line(
      ' //                           this should be stripped'
    );
    var expected = ' ';
    assert_1.default.strictEqual(actual, expected);
  });
  it('should not strip line comments in quoted strings', function () {
    var actual = index_1.default.line('var foo = "//this is not a comment";');
    var expected = 'var foo = "//this is not a comment";';
    assert_1.default.strictEqual(actual, expected);
  });
  it('should strip line comments after quoted strings', function () {
    var actual = index_1.default.line(
      'var foo = "//this is not a comment"; //this should be stripped'
    );
    var expected = 'var foo = "//this is not a comment"; ';
    assert_1.default.strictEqual(actual, expected);
  });
  it('should not be whitespace sensitive', function () {
    var actual = index_1.default.line(
      'var foo = "//this is not a comment"; //                           this should be stripped'
    );
    var expected = 'var foo = "//this is not a comment"; ';
    assert_1.default.strictEqual(actual, expected);
  });
  it('should not strip URLs in a quoted string', function () {
    var actual = index_1.default.line(
      'var foo = "http://github.com"; //                           this should be stripped'
    );
    var expected = 'var foo = "http://github.com"; ';
    assert_1.default.strictEqual(actual, expected);
  });
  it('should strip URLs in a line comment', function () {
    var actual = index_1.default.line('// http://github.com"');
    var expected = '';
    assert_1.default.strictEqual(actual, expected);
  });
  it('should strip URLs in a block comment', function () {
    var actual = index_1.default.block('/**\n* http://github.com\n *\n */');
    var expected = '';
    assert_1.default.strictEqual(actual, expected);
  });
  it('should strip line comments before a function, and not block comments', function () {
    var actual = index_1.default.line(
      '/* this is a comment */\n//this is a comment\nvar bar = function(/*this is a comment*/) {return;};'
    );
    var expected =
      '/* this is a comment */\n\nvar bar = function(/*this is a comment*/) {return;};';
    assert_1.default.strictEqual(actual, expected);
  });
  it('should strip line comments before and after a function, and not block comments', function () {
    var actual = index_1.default.line(
      '/* this is a comment */\n//this is a comment\nvar bar = function(/*this is a comment*/) {return;};\n//this is a line comment'
    );
    var expected =
      '/* this is a comment */\n\nvar bar = function(/*this is a comment*/) {return;};\n';
    assert_1.default.strictEqual(actual, expected);
  });
});
describe('performance', function () {
  it('should not timeout', function () {
    var actual = (0, index_1.default)(
      '\n      console.log(tpl`\n        123\n      `);\n      '
        .concat(
          Array(10).fill('console.log(/^http:\\/\\//.test("1"));').join('\n'),
          '\n\n      '
        )
        .concat(Array(100).fill('console.log("1");').join('\n'), '\n\n    ')
    );
    var expected = actual;
    assert_1.default.strictEqual(actual, expected);
  });
});
