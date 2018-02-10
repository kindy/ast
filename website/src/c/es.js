import * as babel from 'babel-core';
import env from 'babel-preset-es2015';
import stage0 from 'babel-preset-stage-0';
import react from 'babel-preset-react';
import decorators from 'babel-plugin-transform-decorators-legacy';
import flowStripTypes from 'babel-plugin-transform-flow-strip-types';

const options = {
  presets: [
    env,
    stage0,
    react,
  ],
  plugins: [
    flowStripTypes,
    decorators,
  ],
  ast: false,
  babelrc: false,
  highlightCode: false,
};

// es6+ -> es5 / es6 (with babel)
export function transform(code) {
  return babel.transform(code, options).code;
}

// js source code to ES module
export function compileModule(code, globals = {}) {
  let exports = {};
  let module = { exports };
  let globalNames = Object.keys(globals);
  let keys = ['module', 'exports', ...globalNames];
  let values = [module, exports, ...globalNames.map(key => globals[key])];

  new Function(keys.join(), code).apply(exports, values);

  return module.exports;
}
