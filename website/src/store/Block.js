import {action, flow, reaction, types, destroy, getParent} from 'common/mobx';
import {compileModule, transformCode, babelEnv} from 'common/es';
import {isEqual, load, pick} from 'common/utils';

const defaultCode = require('!raw-loader!./data/defaultCode.js'); // eslint-disable-line

export const Block = types.model('Block', {
  id: types.identifier(),
  parent: types.maybe(types.reference(types.late(() => Block))),
  name: types.optional(types.string, ''),
  input: types.optional(types.string, ''),
  code: types.optional(types.string, defaultCode),
  config: types.optional(types.frozen, {}), // generate by `code` and config by UI
  results: types.frozen, // output by `code`
  runError: types.frozen, // errors by run `code`
  runs: types.optional(types.map(types.frozen), {}), // helper for record run `code`
}).views(self => ({
  get codeModule() {
    try {
      return compileModule(transformCode(self.code));
    } catch (ex) {
      return new Error(ex);
    }
  },

  get running() {
    return self.runs.size > 0;
  },
  get configMeta() {
    return self.codeModule.config;
  },
  get configStr() {
    return JSON.stringify(self.config);
  },
  get runKey() {
    return {
      input: self.input,
      code: self.code,
      config: self.configStr,
    };
  },
})).actions(self => {
  let runingKey;
  let resultsRunKey;
  let _watch;

  // {load, babel,}
  const context = Object.freeze({
    babel: Object.freeze(babelEnv),
    load,
  });

  function isRunKeyValid(runKey) {
    return isEqual(self.runKey, runKey);
  }

  return {
    afterCreate() {
      // TODO: if input is null, then read `defaultInput` from `code`
      if (!self.input) {
        self.resetInput();
      }

      _watch = reaction(() => pick(self, ['codeModule', 'input', 'config']),
        (data, reaction) => {
          console.log('block autorun watchResults');
          self.watchResults(data, reaction);
        }, {
          fireImmediately: true,
          // delay: 200,
        });
    },
    beforeDestroy() {
      _watch();
    },

    doUpdate(props) {
      Object.assign(self, props);
    },
    resetInput() {
      self.input = self.codeModule.defaultInput;
    },

    remove() {
      getParent(self, 2).removeBlock(self);
    },

    watchResults: flow(function* watchResults(data, reaction) {
      // console.log('block watchResults 001', reaction, _watch, data);

      const id = String(Math.random());
      let runKey;

      self.runError = null;

      try {
        const {codeModule, input, config} = self; // XXX: input & config to force depends
        if (codeModule instanceof Error) {
          self.runError = codeModule;
          return;
        }

        runKey = self.runKey;
        console.log('block run runKey', runKey);

        const check = () => isEqual(runKey, runingKey) ||
          (self.results && isEqual(resultsRunKey, runKey));
        if (check()) {
          console.log('block watchResults 003', runKey, runingKey,
            resultsRunKey);
          return;
        }

        self.runs.set(id, {runKey});

        runingKey = runKey;
        self.runError = null;

        const {depends: loadDeps, default: run} = codeModule;

        const baseArg = {
          input,
          config,
        };

        const depends = yield loadDeps({
          ...baseArg,
          context,
        });
        if (!isRunKeyValid(runKey)) {
          console.log('block watchResults 004');
          return;
        }

        const {ast, results = {}} = run({
          ...baseArg,
          depends,
        });
        console.log('block run got', ast, results);

        self.results = {
          ...results,
          ast,
        };
        self.trackAction();

        resultsRunKey = runKey;
      } catch (ex) {
        self.trackAction(() => {
          self.runError = ex;
        });
        console.log('block watchResults 005', ex);
      } finally {
        console.log('block watchResults finally');

        self.runs.delete(id);
        self.trackAction();

        if (runKey === runingKey) {
          runingKey = null;
        }
        runKey = null;
      }
    }),
    trackAction(fake) {
      if (!fake) {
        setTimeout(() => self.trackAction(true), 0);
      }
    },

  };
});

export const SampleBlocks = (ctx => class  {
  static ctx = ctx;

  // [id]: {code}
  static idMap = ctx.keys().reduce((memo, key) => {
    const id = key.replace(/^[.\/]+|\.jsx?$/g, '');
    if (id !== 'defaultCode') {
      memo[id] = {code: ctx(key)};
    }

    return memo;
  }, {});

  static getBlock(id) {
    const {[id]: {code}} = this.idMap;
    return {
      code,
    };
  }

  static getIds() {
    return Object.keys(this.idMap);
  }

})(require.context('!raw-loader!./data/', true, /\.js$/));
