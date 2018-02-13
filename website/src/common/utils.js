import {require as unpkgLoader, requireFrom} from 'd3-require';
export * from 'lodash';
export {default as safeStringify} from 'json-stringify-safe';
export {default as yaml} from 'js-yaml';

const makeLoad = loader => name => {
  if (Array.isArray(name)) {
    return Promise.all(name.map(x => loader(x)));
  } else {
    // TODO: object type support
    return loader(name);
  }
};
const loadFrom = resolver => makeLoad(requireFrom(resolver));

export const load = makeLoad(unpkgLoader);
load.__doc__ = `see https://github.com/d3/d3-require for info`;

load.packd = loadFrom(name => `https://bundle.run/${name}`);
load.packd.__doc__ = `see https://bundle.run/ for info`;

load.loadFrom = loadFrom;
