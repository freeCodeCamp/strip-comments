'use strict';

import { TextNode, Block } from './Node';
import * as languages from './languages';

const constants = {
  ESCAPED_CHAR_REGEX: /^\\./,
  QUOTED_STRING_REGEX: /^(['"`])((?:\\\1|[^\1])*?)(\1)/,
  NEWLINE_REGEX: /^\r*\n/,
};

export interface Options {
  language?: string;
  line?: boolean;
  block?: boolean;
  keepProtected?: boolean;
  preserveNewlines?: boolean;
  safe?: boolean;
  first?: boolean;
}

const parse = (input: string | number, options: Options) => {
  if (typeof input !== 'string') {
    throw new TypeError('Expected input to be a string');
  }

  const cst = new Block({ type: 'root', nodes: [] });
  const stack = [cst];
  const name = (options.language || 'javascript').toLowerCase();
  const lang = languages[name];

  if (typeof lang === 'undefined') {
    throw new Error(`Language "${name}" is not supported by strip-comments`);
  }

  const { LINE_REGEX, BLOCK_OPEN_REGEX, BLOCK_CLOSE_REGEX } = lang;
  let block = cst;
  let remaining = input;
  let token: {
    type: string;
    value: string;
    match: RegExpExecArray;
    newline?: string;
  };
  let prev: Block | TextNode;

  const source = [BLOCK_OPEN_REGEX, BLOCK_CLOSE_REGEX].filter(Boolean);
  let tripleQuotes = false;

  if (source.every((regex) => regex.source === '^"""')) {
    tripleQuotes = true;
  }

  /**
   * Helpers
   */

  const consume = (value = remaining[0] || '') => {
    remaining = remaining.slice(value.length);
    return value;
  };

  const scan = (regex: RegExp, type = 'text') => {
    const match = regex.exec(remaining);
    if (match) {
      consume(match[0]);
      return { type, value: match[0], match };
    }
  };

  const push = (node: Block | TextNode) => {
    if (prev && prev.type === 'text' && node.type === 'text') {
      prev.value += node.value;
      return;
    }

    block.push(node);

    if (node instanceof Block) {
      if (node.nodes) {
        stack.push(node);
        block = node;
      }
    }

    prev = node;
  };

  const pop = () => {
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
      push(new TextNode(token));
      continue;
    }

    // quoted strings
    if (
      block.type !== 'block' &&
      (!prev || !/\w$/.test(prev.value)) &&
      !(tripleQuotes && remaining.startsWith('"""'))
    ) {
      if ((token = scan(constants.QUOTED_STRING_REGEX, 'text'))) {
        push(new TextNode(token));
        continue;
      }
    }

    // newlines
    if ((token = scan(constants.NEWLINE_REGEX, 'newline'))) {
      push(new TextNode(token));
      continue;
    }

    // block comment open
    if (
      BLOCK_OPEN_REGEX &&
      options.block &&
      !(tripleQuotes && block.type === 'block')
    ) {
      if ((token = scan(BLOCK_OPEN_REGEX, 'open'))) {
        push(new Block({ type: 'block' }));
        push(new TextNode(token));
        continue;
      }
    }

    // block comment close
    if (BLOCK_CLOSE_REGEX && block.type === 'block' && options.block) {
      if ((token = scan(BLOCK_CLOSE_REGEX, 'close'))) {
        token.newline = token.match[1] || '';
        push(new TextNode(token));
        pop();
        continue;
      }
    }

    // line comment
    if (LINE_REGEX && block.type !== 'block' && options.line) {
      if ((token = scan(LINE_REGEX, 'line'))) {
        push(new TextNode(token));
        continue;
      }
    }

    // Plain text (skip "C" since some languages use "C" to start comments)
    if ((token = scan(/^[a-zABD-Z0-9\t ]+/, 'text'))) {
      push(new TextNode(token));
      continue;
    }

    push(new TextNode({ type: 'text', value: consume(remaining[0]) }));
  }

  return cst;
};

export default parse;
