export const config = {};

export const defaultInput = `
/**
 * Paste or drop some CSS here and explore
 * the syntax tree created by chosen parser.
 * Enjoy!
 */

@media screen and (min-width: 480px) {
  body {
    background-color: lightgreen;
  }
}

#main {
  border: 1px solid black;
}

ul li {
  padding: 5px;
}
`.trim();

export function depends({context: {load}, config}) {
  return load.packd([
    'cssom/lib/parse.js',
  ]).then(([cssom]) => ({cssom}));
}

export default function run({input, config, depends: {cssom}}) {
  const ast = cssom.parse(input);

  return {
    ast,
  };
};
