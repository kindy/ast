import {types, flow, reaction, action} from 'c/mobx';
import {transform, compileModule} from 'c/es';
import {load, isEqual, pick} from 'c/utils';

const defaultInput = `
input can be any thing.
:)

`.trim();

const defaultCode = `
/* your parser/transform code */

/* can only run in sync mode
 */
export default function({input, depends: {abc}, config}) {
  return {
    ast: {abc}, // ast is special, other results should be under \`results\` key
    results: {
      input,
      out: 'output a',
      abc,
      moreOutput: 'abc',
    },
  };
};

/* accept promise
 * can use load to load packages from unpkg.com
 */
export function depends({load, config}) {
  return Promise.resolve({abc: "I'm abc from depends"});
};

export const config = {};
`.trim();

export const Block = types.model('Block', {
  id: types.identifier(),
  parent: types.maybe(types.reference(types.late(() => Block))),
  input: types.optional(types.string, defaultInput),
  code: types.optional(types.string, defaultCode),
  config: types.optional(types.frozen, {}),
  results: types.frozen,
  runError: types.frozen,
  runs: types.optional(types.map(types.frozen), {}),
}).views(self => ({
  get codeModule() {
    try {
      return compileModule(transform(self.code));
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

  function isRunKeyValid(runKey) {
    return isEqual(self.runKey, runKey);
  }

  return {
    afterCreate() {
      _watch = reaction(() => pick(self, ['codeModule', 'input', 'config']), (data, reaction) => {
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
          console.log('block watchResults 003', runKey, runingKey, resultsRunKey);
          return;
        }

        self.runs.set(id, {runKey});

        runingKey = runKey;
        self.runError = null;

        const {default: run, depends: loadDeps} = codeModule;

        const depends = yield loadDeps(
          {load, block: self, config: self.config});
        if (!isRunKeyValid(runKey)) {
          console.log('block watchResults 004');
          return;
        }

        const {ast, results = {}} = run(
          {input: input, block: self, config: config, depends});
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

    doUpdate(props) {
      Object.assign(self, props);
    },
  };
});

export const Play = types.model('Play', {
  id: types.identifier(),
  nextBlockId: types.optional(types.number, 1),
  blocks: types.optional(types.array(Block), []),
}).actions(self => {

  return {
    addBlock(obj) {
      if (!obj.id) {
        obj.id = String(self.nextBlockId++);
      }

      self.blocks.push(obj);
    },

    addSampleBlock() {
      const input = `<a><b v:if={a} /></a>`.trim();
      const code = `
const options = (plugins = []) => ({
  ast: true,
  babelrc: false,
  plugins: [
    ...x,
    'syntax-jsx',
  ],
});

export default function({input, block, config, depends: {babel, vJsx}}) {
  const {ast, code: out} = babel.transform(input, options([vJsx]));

  return {
    ast,
    results: {
      out,
    },
  };
};

export function depends({block, load, config}) {
  return load([
    'babel-standalone',
    'https://bundle.run/babel-plugin-transform-v-jsx',
  ]).then(([babel, vJsx]) => ({babel, vJsx}));
};

export const config = {};
    `.trim();

      self.addBlock({input, code,});
    },
  };
});


export const PlayStore = types.model('PlayStore', {
  plays: types.map(Play),
  opened: types.optional(types.array(Play), []),
  activeId: types.optional(types.string, ''),
}).views(self => ({
  get curPlay() {
    return self.plays.get(self.activeId);
  },

})).actions(self => {
  let nextPlayId = 1;

  return {
    addPlay(obj) {
      if (!obj.id) {
        obj.id = String(nextPlayId++);
      }

      self.plays.put(obj);
    },

    setPlayId(id) {
      self.activeId = id;
    },

  };
});
