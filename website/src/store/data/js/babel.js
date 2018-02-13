export const config = {};

export const defaultInput = `
<a><b v:if={a} /></a>
`.trim();

export function depends({context: {load}, config}) {
  return load([
    'babel-standalone',
  ]).then(([babel]) => ({babel}));
}

export default function run({input, config, depends: {babel}}) {
  const {ast} = babel.transform(input, options());

  return {
    ast,
  };
};

const options = (plugins = []) => ({
  ast: true,
  babelrc: false,
  plugins: [
    ...plugins,
    'syntax-jsx',
  ],
});
