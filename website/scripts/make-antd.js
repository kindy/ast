const path = require('path');
const fs = require('fs');

const txt = fs.readFileSync(path.resolve('node_modules/antd/es/index.js'), 'utf-8');
const re = /as\s+(\S+)\s*\}\s+from\s+'\.\/(.+?)'/g;

const mods = [];
let m;

while ((m = re.exec(txt))) {
  const [$, name, file] = m;

  const f = `import 'antd/lib/${file}/style';
export {default, default as ${name}} from 'antd/lib/${file}';
`;

  mods.push(name);
  fs.writeFileSync(path.resolve(`src/c/ui/antd/${name}.js`), f);
  // console.log(name, file);
}

let f = mods.map(m => `export {${m}} from './${m}';
`).join('');
fs.writeFileSync(path.resolve(`src/c/ui/antd/index.js`), f);

console.log('done');
