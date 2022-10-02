'use strict';

import { Block, TextNode } from './Node';
import { Options } from './parse';

export default (cst: Block, options: Options) => {
  const keepProtected = options.safe === true || options.keepProtected === true;
  let firstSeen = false;

  const walk = (node: Block | TextNode) => {
    let output = '';
    let inner: string;
    let lines: string[];

    if (node instanceof Block) {
      for (const child of node?.nodes) {
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
    }

    return output;
  };

  return walk(cst);
};
