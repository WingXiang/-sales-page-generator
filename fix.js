import fs from 'fs';
let data = fs.readFileSync('src/utils/templateGenerator.js', 'utf8');
data = data.replace(/\\`/g, '`').replace(/\\\$/g, '$');
fs.writeFileSync('src/utils/templateGenerator.js', data);
