'use strict';

export interface TextNodeConstructor {
  type?: string;
  value?: string;
  match?: RegExpExecArray;
  newline?: string;
}

class TextNode {
  type?: string;
  value?: string;
  match?: RegExpExecArray;
  newline?: string;

  constructor(node: TextNodeConstructor) {
    this.type = node.type;
    if (node.value) this.value = node.value;
    if (node.match) this.match = node.match;
    this.newline = node.newline || '';
  }

  get protected() {
    return Boolean(this.match) && this.match[1] === '!';
  }
}

export interface BlockConstructor extends TextNodeConstructor {
  nodes?: (Block | TextNode)[];
}

class Block extends TextNode {
  nodes?: (Block | TextNode)[];

  constructor(node: BlockConstructor) {
    super(node);

    this.nodes = node.nodes || [];
  }

  push(node: Block | TextNode) {
    this.nodes.push(node);
  }

  get protected() {
    return this.nodes.length > 0 && this.nodes[0].protected === true;
  }
}

export { TextNode, Block };
