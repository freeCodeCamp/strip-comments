'use strict';

import fs from 'fs';
import strip from '../index';

const all = fs.readFileSync('test/fixtures/strip-all.js', 'utf8');

console.log(strip(all));
