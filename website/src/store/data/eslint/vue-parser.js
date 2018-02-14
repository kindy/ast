export const config = {};

export const defaultInput = `
<template>
  <div :class="classes">
    <div :class="headClasses" v-if="showHead"><slot name="title"></slot></div>
  </div>
</template>
<script>
  const prefixCls = 'ivu-card';

  export default {
    props: {
      bordered: { type: Boolean, default: true },
    },
    data () { return { showHead: true, }; },
    computed: {
      classes () {
        return [
          \`\${prefixCls}\`,
          {
            [\`\${prefixCls}-bordered\`]: this.bordered && !this.shadow,
          }
        ];
      },
    },
    mounted () {
      this.showHead = this.$slots.title !== undefined;
    }
  };
</script>
`.trim();

export function depends({context: {load}, config}) {
  return load.packd([
    'vue-eslint-parser',
    'espree',
  ]).then(([{parse}, espree]) => ({parse, espree}));
}

export default function run({input, config, depends: {parse, espree}}) {
  const oldReq = window.require;
  window.require = (name) => name === 'espree' ? espree : null;
  const ast = parse(input, {
      'sourceType': 'module',
      'ecmaVersion': 2017,
      'ecmaFeatures': {
        'globalReturn': false,
        'impliedStrict': false,
        'jsx': false,
        'experimentalObjectRestSpread': false,
      },
    },
  );
  window.require = oldReq;

  return {
    ast,
  };
};
