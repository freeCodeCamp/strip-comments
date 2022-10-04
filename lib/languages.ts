'use strict';

export const ada = { LINE_REGEX: /^--.*/ };
export const apl = { LINE_REGEX: /^⍝.*/ };

export const applescript = {
  BLOCK_OPEN_REGEX: /^\(\*/,
  BLOCK_CLOSE_REGEX: /^\*\)/,
};

export const csharp = {
  LINE_REGEX: /^\/\/.*/,
};

export const haskell = {
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
export const javascript = {
  BLOCK_OPEN_REGEX: /^\/\*\*?(!?)/,
  BLOCK_CLOSE_REGEX: /^\*\/(\n?)/,
  LINE_REGEX: /^\/\/(!?).*/,
};

export const lua = {
  BLOCK_OPEN_REGEX: /^--\[\[/,
  BLOCK_CLOSE_REGEX: /^\]\]/,
  LINE_REGEX: /^--.*/,
};

export const matlab = {
  BLOCK_OPEN_REGEX: /^%{/,
  BLOCK_CLOSE_REGEX: /^%}/,
  LINE_REGEX: /^%.*/,
};

export const perl = {
  LINE_REGEX: /^#.*/,
};

export const php = {
  ...javascript,
  LINE_REGEX: /^(#|\/\/).*?(?=\?>|\n)/,
};

export const python = {
  BLOCK_OPEN_REGEX: /^"""/,
  BLOCK_CLOSE_REGEX: /^"""/,
  LINE_REGEX: /^#.*/,
};

export const ruby = {
  BLOCK_OPEN_REGEX: /^=begin/,
  BLOCK_CLOSE_REGEX: /^=end/,
  LINE_REGEX: /^#.*/,
};

export const hashbang = {
  LINE_REGEX: /^#!.*/,
};

export const shebang = hashbang;
export const c = javascript;
export const css = javascript;
export const java = javascript;
export const js = javascript;
export const less = javascript;
export const swift = javascript;
export const ts = javascript;
export const typscript = javascript;
export const sass = javascript;
export const pascal = applescript;
export const ocaml = applescript;
export const sql = ada;
