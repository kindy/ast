export const config = {};

export const defaultInput = `
<a><b v-if="a" /></a>
`.trim();

export function depends({context: {load, prettier}, config}) {
  return load([
    'vue-template-compiler',
  ]).then(([vtc]) => ({vtc, prettier}));
}

export default function run({input, config, depends: {vtc, prettier}}) {
  const {ast, render, staticRenderFns} = vtc.compile(input, {});

  return {
    ast,
    results: {
      render: prettier.format(render),
      ...(staticRenderFns && staticRenderFns.length ? {
        staticFns: staticRenderFns,
      } : {}),
    },
  };
};
