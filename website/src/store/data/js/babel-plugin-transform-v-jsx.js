export const config = {};

export const defaultInput = `
<a><b v:if={a} /></a>
`.trim();

export function depends({context: {load}, config}) {
  return load([
    'babel-standalone',
    'https://bundle.run/babel-plugin-transform-v-jsx',
  ]).then(([babel, vJsx]) => ({babel, vJsx}));
}

export default function run({input, config, depends: {babel, vJsx}}) {
  const {ast, code: out} = babel.transform(input, options([vJsx]));

  return {
    ast,
    results: {
      out,
    },
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
