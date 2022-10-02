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
var fs_1 = require('fs');
var path_1 = __importDefault(require('path'));
var assert_1 = __importDefault(require('assert'));
var index_1 = __importDefault(require('../index'));
var fixture = path_1.default.join.bind(
  path_1.default,
  __dirname,
  'fixtures/html'
);
var expected = path_1.default.join.bind(
  path_1.default,
  __dirname,
  'expected/html'
);
var read = function (src) {
  return (0, fs_1.readFileSync)(src, 'utf-8').replace(/\r*\n/g, '\n');
};
describe.skip('HTML comments', function () {
  it('should strip HTML comments.', function () {
    var actual = (0, index_1.default)('No <!-- I should be gone-->comment', {
      language: 'html',
    });
    assert_1.default.strictEqual(actual, 'No comment');
  });
  it('should not strip comments inside quoted strings.', function () {
    var input = 'No "<!-- I should NOT be gone-->"comment';
    var actual = (0, index_1.default)(input, { language: 'html' });
    assert_1.default.strictEqual(actual, input);
  });
  it('should not strip comment _parts_ inside quoted strings.', function () {
    var name = 'quoted';
    var input = read(fixture(''.concat(name, '.html')));
    var output = read(expected(''.concat(name, '.html')));
    var actual = (0, index_1.default)(input, { language: 'html' });
    assert_1.default.strictEqual(actual, output);
  });
  it('should strip multiline comments', function () {
    var name = 'multiline';
    var input = read(fixture(''.concat(name, '.html')));
    var output = read(expected(''.concat(name, '.html')));
    var actual = (0, index_1.default)(input, { language: 'html' });
    assert_1.default.strictEqual(actual, output);
  });
  it('should strip comments with only dashes', function () {
    var name = 'dashes';
    var input = read(fixture(''.concat(name, '.html')));
    var output = read(expected(''.concat(name, '.html')));
    var actual = (0, index_1.default)(input, { language: 'html' });
    assert_1.default.strictEqual(actual, output);
  });
});
