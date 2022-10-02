import strip from '../index';

const str = strip.block('const foo = "bar";// this is a comment\n /* me too */');
console.log(str);
// => 'const foo = "bar";// this is a comment'
