export const config = {};

export const defaultInput = `
<a><b v-if="a" /></a>
`.trim();

export function depends({context: {load, getPrettier}, config}) {
  return Promise.all([
    load('vue-template-compiler'),
    getPrettier(),
  ]).then(([vtc, prettier]) => ({vtc, prettier}));
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

