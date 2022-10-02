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
var fixture = path_1.default.join.bind(
  path_1.default,
  __dirname,
  'fixtures/other'
);
var expected = path_1.default.join.bind(
  path_1.default,
  __dirname,
  'expected/other'
);
var read = function (src) {
  return fs_1.default.readFileSync(src, 'utf-8').replace(/\r*\n/g, '\n');
};
describe('other languages', function () {
  it('should strip Ada comments', function () {
    var name = 'ada';
    var input = read(fixture(''.concat(name, '.txt')));
    var output = read(expected(''.concat(name, '.txt')));
    var actual = (0, index_1.default)(input, {
      language: name,
      preserveNewlines: true,
    });
    assert_1.default.strictEqual(actual, output);
  });
  it('should strip APL comments', function () {
    var name = 'apl';
    var input = read(fixture(''.concat(name, '.txt')));
    var output = read(expected(''.concat(name, '.txt')));
    var actual = (0, index_1.default)(input, {
      language: name,
      preserveNewlines: true,
    });
    assert_1.default.strictEqual(actual, output);
  });
  it('should strip C comments', function () {
    var name = 'c';
    var input = read(fixture(''.concat(name, '.txt')));
    var output = read(expected(''.concat(name, '.txt')));
    var actual = (0, index_1.default)(input, {
      language: name,
      preserveNewlines: true,
    });
    assert_1.default.strictEqual(actual, output);
  });
  it('should strip AppleScript comments', function () {
    var name = 'AppleScript';
    var input = read(fixture(''.concat(name, '.txt')));
    var output = read(expected(''.concat(name, '.txt')));
    var actual = (0, index_1.default)(input, { language: name });
    assert_1.default.strictEqual(actual, output);
  });
  it('should strip Haskell comments', function () {
    var name = 'haskell';
    var input = read(fixture(''.concat(name, '.txt')));
    var output = read(expected(''.concat(name, '.txt')));
    var actual = (0, index_1.default)(input, { language: name });
    assert_1.default.strictEqual(actual, output);
  });
  it('should strip Lua comments', function () {
    var name = 'lua';
    var input = read(fixture(''.concat(name, '.txt')));
    var output = read(expected(''.concat(name, '.txt')));
    var actual = (0, index_1.default)(input, { language: name });
    assert_1.default.strictEqual(actual, output);
  });
  it('should strip MATLAB comments', function () {
    var name = 'matlab';
    var input = read(fixture(''.concat(name, '.txt')));
    var output = read(expected(''.concat(name, '.txt')));
    var actual = (0, index_1.default)(input, { language: name });
    assert_1.default.strictEqual(actual, output);
  });
  it('should strip OCaml comments', function () {
    var name = 'ocaml';
    var input = read(fixture(''.concat(name, '.txt')));
    var output = read(expected(''.concat(name, '.txt')));
    var actual = (0, index_1.default)(input, { language: name });
    assert_1.default.strictEqual(actual, output);
  });
  it('should strip Pascal comments', function () {
    var name = 'pascal';
    var input = read(fixture(''.concat(name, '.txt')));
    var output = read(expected(''.concat(name, '.txt')));
    var actual = (0, index_1.default)(input, { language: name });
    assert_1.default.strictEqual(actual, output);
  });
  it('should strip PHP comments', function () {
    var name = 'php';
    var input = read(fixture(''.concat(name, '.txt')));
    var output = read(expected(''.concat(name, '.txt')));
    var actual = (0, index_1.default)(input, { language: name });
    assert_1.default.strictEqual(actual, output);
  });
  it('should strip Perl comments', function () {
    var name = 'perl';
    var input = read(fixture(''.concat(name, '.txt')));
    var output = read(expected(''.concat(name, '.txt')));
    var actual = (0, index_1.default)(input, { language: name });
    assert_1.default.strictEqual(actual, output);
  });
  it('should strip Python comments', function () {
    var name = 'python';
    var input = read(fixture(''.concat(name, '.txt')));
    var output = read(expected(''.concat(name, '.txt')));
    var actual = (0, index_1.default)(input, { language: name });
    assert_1.default.strictEqual(actual, output);
  });
  it('should strip Ruby comments', function () {
    var name = 'ruby';
    var input = read(fixture(''.concat(name, '.txt')));
    var output = read(expected(''.concat(name, '.txt')));
    var actual = (0, index_1.default)(input, { language: name });
    assert_1.default.strictEqual(actual, output);
  });
  it('should strip shebang comments', function () {
    var name = 'shebang';
    var input = read(fixture(''.concat(name, '.txt')));
    var output = read(expected(''.concat(name, '.txt')));
    var actual = (0, index_1.default)(input, { language: name });
    assert_1.default.strictEqual(actual, output);
  });
  it('should strip SQL comments', function () {
    var name = 'sql';
    var input = read(fixture(''.concat(name, '.txt')));
    var output = read(expected(''.concat(name, '.txt')));
    var actual = (0, index_1.default)(input, { language: name });
    assert_1.default.strictEqual(actual, output);
  });
  it('should strip Swift comments', function () {
    var name = 'swift';
    var input = read(fixture(''.concat(name, '.txt')));
    var output = read(expected(''.concat(name, '.txt')));
    var actual = (0, index_1.default)(input, { language: name });
    assert_1.default.strictEqual(actual, output);
  });
});
