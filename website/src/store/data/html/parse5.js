export const config = {};

export const defaultInput = `
<a><b v:if={a} /></a>
`.trim();

export function depends({context: {load}, config}) {
  return load.packd([
    'parse5',
  ]).then(([parse5]) => ({parse5}));
}

export default function run({input, config, depends: {parse5}}) {
  const ast = parse5.parse(input);

  return {
    ast,
  };
};
