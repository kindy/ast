const yaml = require('js-yaml');


module.exports = function(source) {
  const svgs = yaml.load(source);

  return `
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  ${Object.keys(svgs).map(name => `
  Object.defineProperty(exports, ${JSON.stringify(name)}, {
    enumerable: true,
    value: ${JSON.stringify(svgs[name])}
  });
  `).join('\n')}
  `;
};
