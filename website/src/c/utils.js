import {require as d3Require} from 'd3-require';
export * from 'lodash';

export function load(name) {
  if (Array.isArray(name)) {
    return Promise.all(name.map(x => d3Require(x)));
  } else {
    return d3Require(name);
  }
}
load.from = function(resolver) {
  throw new Error('not impl yet');
};
