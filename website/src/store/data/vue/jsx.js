export const config = {};

// src: https://github.com/vuejs/babel-plugin-transform-vue-jsx
export const defaultInput = `
class VueDialog {
  render (h) {
    return (
      <div
        // normal attributes or component props.
        id="foo"
        // DOM properties are prefixed with \`domProps\`
        domPropsInnerHTML="bar"
        // event listeners are prefixed with \`on\` or \`nativeOn\`
        onClick={this.clickHandler}
        nativeOnClick={this.nativeClickHandler}
        // other special top-level properties
        class={{ foo: true, bar: false }}
        style={{ color: 'red', fontSize: '14px' }}
        key="key"
        ref="ref"
        // assign the \`ref\` is used on elements/components with v-for
        refInFor
        slot="slot">
      </div>
    )
  }
}
`.trim();

export function depends({context: {load}, config}) {
  return load([
    'babel-standalone',
    'babel-plugin-transform-vue-jsx',
  ]).then(([babel, jsx]) => ({babel, jsx}));
}

export default function run({input, config, depends: {babel, jsx}}) {
  const {ast, code: out} = babel.transform(input, options([jsx]));

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
    'syntax-jsx',
    ...plugins,
  ],
});
