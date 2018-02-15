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


function _ga() {
  _ga.q.push(arguments);
}
_ga.q = [];
// TODO: ga.gp
window.ga = _ga;
export function ga(...args) {
  window.ga(...args);
}

export function installGtm(id) {
  (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
      new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
  })(window,document,'script','dataLayer',id);
}
