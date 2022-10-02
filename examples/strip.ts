import strip from '..';

const str = strip('const foo = "bar";/* me too */\n// this is a comment');

console.log(str);
