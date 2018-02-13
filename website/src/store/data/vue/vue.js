export const config = {};

export const defaultInput = `
<a><b v-if="a" /></a>
`.trim();

export function depends({context: {load}, config}) {
  return load([
    'vue-template-compiler',
  ]).then(([vtc]) => ({vtc}));
}

export default function run({input, config, depends: {vtc}}) {
  const {ast, render, staticRenderFns} = vtc.compile(input, {});

  return {
    ast,
    results: {
      render,
      ...(staticRenderFns && staticRenderFns.length ? {
        staticFns: staticRenderFns,
      } : {}),
    },
  };
};
