/*!
 * strip-comments <https://github.com/jonschlinkert/strip-comments>
 *
 * Copyright (c) 2014-2018, Jon Schlinkert.
 * Released under the MIT license.
 */

'use strict';

import fs, { PathOrFileDescriptor } from 'fs';
import path from 'path';
import strip from '../index';

const tests = path.join.bind(path, __dirname);
const read = (src: PathOrFileDescriptor) =>
  fs.readFileSync(src, 'utf-8').replace(/\r*\n/g, '\n');

describe('JavaScript comments', () => {
  it('should strip all comments', () => {
    const actual = strip(
      "'foo'; // this is a comment\n/* me too */ var abc = 'xyz';"
    );
    expect(actual).toStrictEqual("'foo'; \n var abc = 'xyz';");
  });

  it('should work on unclosed (invalid) blocks', () => {
    const actual = strip("'foo'; /* I am invalid ");
    expect(actual).toStrictEqual("'foo'; ");
  });

  it('should strip line comments', () => {
    const actual = strip.line('foo // this is a comment\n/* me too */');
    const expected = 'foo \n/* me too */';
    expect(actual).toStrictEqual(expected);
  });

  it('should not mistake escaped slashes for comments', () => {
    // see https://github.com/jonschlinkert/extract-comments/issues/12
    const expected = "'foo/bar'.replace(/o\\//, 'g')";
    const actual = strip.line(expected);
    expect(actual).toEqual(expected);
  });

  it('should strip block comments', () => {
    const actual = strip.block('foo // this is a comment\n/* me too */');
    const expected = 'foo // this is a comment\n';
    expect(actual).toStrictEqual(expected);
  });

  // see https://github.com/jonschlinkert/strip-comments/issues/31
  it('should only strip the first comment', () => {
    const expected = read(tests('expected/banner.js'));
    const fixture = read(tests('fixtures/banner.js'));
    const actual = strip.first(fixture);
    expect(actual).toStrictEqual(expected);
  });

  // see https://github.com/jonschlinkert/strip-comments/issues/31
  it('should strip the first non-protected comment', () => {
    const expected = read(tests('expected/banner-protected.js'));
    const fixture = read(tests('fixtures/banner.js'));
    const actual = strip.first(fixture, { keepProtected: true });
    expect(actual).toStrictEqual(expected);
  });

  // see https://github.com/jonschlinkert/strip-comments/issues/21
  it('should not strip non-comments in quoted strings 2', () => {
    const expected = read(tests('fixtures/quoted-strings.js'));
    const actual = strip(expected);
    expect(actual).toEqual(expected);
  });

  // see https://github.com/jonschlinkert/strip-comments/issues/18
  it('should not hang on unclosed comments', () => {
    const expected = "if (accept == 'video/*') {";
    const actual = strip(expected);
    // fails because using `esprima` under the hood
    expect(actual).toEqual(expected);
  });

  it('should not mangle json', () => {
    const expected = read(path.join(__dirname, '..', 'package.json'));
    const before = JSON.parse(expected);
    const res = strip(expected);
    const after = JSON.parse(res);
    expect(before).toEqual(after);
  });

  it('should strip all but not `/*/`', () => {
    const actual = strip(
      "/* I will be stripped */\nvar path = '/this/should/*/not/be/stripped';"
    );
    const expected = "var path = '/this/should/*/not/be/stripped';";
    expect(actual).toStrictEqual(expected);
  });

  it('should strip all but not globstars `/**/*` #1', () => {
    const actual = strip("var path = './do/not/strip/globs/**/*.js';");
    const expected = "var path = './do/not/strip/globs/**/*.js';";
    expect(actual).toStrictEqual(expected);
  });

  it('should strip all but not globstars `/**/` #2 and `//!` line comments (safe: true)', () => {
    const actual = strip(
      "var partPath = './path/*/to/scripts/**/'; //! line comment",
      { safe: true }
    );
    const expected =
      "var partPath = './path/*/to/scripts/**/'; //! line comment";
    expect(actual).toStrictEqual(expected);
  });

  it('should strip all but not `/*/*something` from anywhere', () => {
    const actual = strip("var partPath = './path/*/*something/test.txt';");
    const expected = "var partPath = './path/*/*something/test.txt';";
    expect(actual).toStrictEqual(expected);
  });

  it('should strip all but not `/*/*something/*.js` from anywhere (globstar-like)', () => {
    const actual = strip("var partPath = './path/*/*something/*.js';");
    const expected = "var partPath = './path/*/*something/*.js';";
    expect(actual).toStrictEqual(expected);
  });

  it('should leave alone code without any comments', () => {
    const fixture = read(tests('fixtures/no-comment.js'));
    const actual = strip(fixture);
    const expected = fixture;
    expect(actual).toStrictEqual(expected);
  });

  // see https://github.com/jonschlinkert/strip-comments/issues/27
  it('should not break on comments that are substrings of a later comment', () => {
    const actual = strip(
      [
        '// this is a substring',
        '// this is a substring of a larger comment',
        'someCode();',
        'someMoreCode();',
      ].join('\n')
    );
    const expected = ['', '', 'someCode();', 'someMoreCode();'].join('\n');
    expect(actual).toStrictEqual(expected);
  });

  it('should not break on comments that are in between empty strings', () => {
    const actual = strip('""; // comment \n""');
    const expected = '""; \n""';
    expect(actual).toStrictEqual(expected);
  });
});

describe('error handling:', () => {
  it('should throw TypeError when a string is not passed', () => {
    const fixture = () => strip(123);
    expect(fixture).toThrow(TypeError);
    expect(fixture).toThrowError(/expected input to be a string/i);
  });

  it('should throw TypeError when a string is not passed to `.block`', () => {
    const fixture = () => strip.block(123);
    expect(fixture).toThrow(TypeError);
    expect(fixture).toThrowError(/expected input to be a string/i);
  });

  it('should throw TypeError when a string is not passed to `.line`', () => {
    const fixture = () => strip.line(123);
    expect(fixture).toThrow(TypeError);
    expect(fixture).toThrowError(/expected input to be a string/i);
  });

  it('should not throw on empty string, returns empty string', () => {
    const actual = strip('');
    const expected = '';
    expect(typeof actual).toEqual('string');
    expect(actual).toEqual(expected);
  });
});

describe('strip all or empty:', () => {
  it('should strip all multiline, singleline, block and line comments', () => {
    const fixture = read(tests('fixtures/strip-all.js'));
    const expected = read(tests('expected/strip-all.js'));
    const actual = strip(fixture);
    expect(actual).toStrictEqual(expected);
  });

  it('should not strip !important block comments', () => {
    const fixture = read(tests('fixtures/strip-all.js'));
    const actual = strip.block(fixture, { safe: true });
    const expected = read(tests('expected/strip-keep-block.js'));
    expect(actual).toStrictEqual(expected);
  });

  it('should strip only all line comments that not starts with `//!` (safe:true)', () => {
    const fixture = read(tests('fixtures/strip-keep-line.js'));
    const actual = strip.line(fixture, { safe: true });
    const expected = read(tests('expected/strip-keep-line.js'));
    expect(actual).toStrictEqual(expected);
  });
});

describe('strip all keep newlines:', () => {
  it('should strip all comments, but keep newlines', () => {
    const fixture = read(tests('fixtures/strip-all.js'));
    const expected = read(tests('expected/strip-keep-newlines.js'));
    const actual = strip(fixture, { preserveNewlines: true });
    expect(actual).toStrictEqual(expected);
  });
});

describe('block comments:', () => {
  it('should strip block comments from a function', () => {
    const actual = strip.block(
      'var bar = function(/* this is a comment*/) {return;};'
    );
    const expected = 'var bar = function() {return;};';
    expect(actual).toStrictEqual(expected);
  });

  it('should strip block comments before and from a function', () => {
    const actual = strip.block(
      '/* this is a comment */\nvar bar = function(/*this is a comment*/) {return;};'
    );
    const expected = 'var bar = function() {return;};';
    expect(actual).toStrictEqual(expected);
  });

  it('should strip block comments before, after and from a function', () => {
    const actual = strip.block(
      '/* this is a comment */var bar = function(/*this is a comment*/) {return;};\n/* this is a comment*/'
    );
    const expected = 'var bar = function() {return;};\n';
    expect(actual).toStrictEqual(expected);
  });
});

describe('line comments:', () => {
  it('should strip line comments', () => {
    const actual = strip.line(
      '// this is a line comment\nvar bar = function(/*this is a comment*/) {return;};'
    );
    const expected = '\nvar bar = function(/*this is a comment*/) {return;};';
    expect(actual).toStrictEqual(expected);
  });

  it('should strip line comments with leading whitespace', () => {
    const actual = strip.line(
      ' //                           this should be stripped'
    );
    const expected = ' ';
    expect(actual).toStrictEqual(expected);
  });

  it('should not strip line comments in quoted strings', () => {
    const actual = strip.line('var foo = "//this is not a comment";');
    const expected = 'var foo = "//this is not a comment";';
    expect(actual).toStrictEqual(expected);
  });

  it('should strip line comments after quoted strings', () => {
    const actual = strip.line(
      'var foo = "//this is not a comment"; //this should be stripped'
    );
    const expected = 'var foo = "//this is not a comment"; ';
    expect(actual).toStrictEqual(expected);
  });

  it('should not be whitespace sensitive', () => {
    const actual = strip.line(
      'var foo = "//this is not a comment"; //                           this should be stripped'
    );
    const expected = 'var foo = "//this is not a comment"; ';
    expect(actual).toStrictEqual(expected);
  });

  it('should not strip URLs in a quoted string', () => {
    const actual = strip.line(
      'var foo = "http://github.com"; //                           this should be stripped'
    );
    const expected = 'var foo = "http://github.com"; ';
    expect(actual).toStrictEqual(expected);
  });

  it('should strip URLs in a line comment', () => {
    const actual = strip.line('// http://github.com"');
    const expected = '';
    expect(actual).toStrictEqual(expected);
  });

  it('should strip URLs in a block comment', () => {
    const actual = strip.block('/**\n* http://github.com\n *\n */');
    const expected = '';
    expect(actual).toStrictEqual(expected);
  });

  it('should strip line comments before a function, and not block comments', () => {
    const actual = strip.line(
      '/* this is a comment */\n//this is a comment\nvar bar = function(/*this is a comment*/) {return;};'
    );
    const expected =
      '/* this is a comment */\n\nvar bar = function(/*this is a comment*/) {return;};';
    expect(actual).toStrictEqual(expected);
  });

  it('should strip line comments before and after a function, and not block comments', () => {
    const actual = strip.line(
      '/* this is a comment */\n//this is a comment\nvar bar = function(/*this is a comment*/) {return;};\n//this is a line comment'
    );
    const expected =
      '/* this is a comment */\n\nvar bar = function(/*this is a comment*/) {return;};\n';
    expect(actual).toStrictEqual(expected);
  });
});

describe('performance', () => {
  it('should not timeout', () => {
    const actual = strip(`
      console.log(tpl\`
        123
      \`);
      ${Array(10).fill('console.log(/^http:\\/\\//.test("1"));').join('\n')}\n
      ${Array(100).fill('console.log("1");').join('\n')}\n
    `);
    const expected = actual;
    expect(actual).toStrictEqual(expected);
  });
});
