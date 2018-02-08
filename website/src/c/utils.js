import * as d3Require from 'd3-require';

export function load(name) {
  return d3Require.require(name);
}
load.from = function(resolver) {
  throw new Error('not impl yet');
};
