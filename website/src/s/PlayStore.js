import {observable, computed, action, autorun} from 'c/mobx';
import {transform, compileModule} from 'c/es';
import {load, isEqual} from 'c/utils';


export default class PlayStore {
  @observable plays = [];

  constructor() {
    // autorun(() => console.log(this.report));
  }

  @action
  addPlay(obj) {
    this.plays.push(Play.get(obj));
  }
}

class Play {
  static nextId = 1;

  id;
  @observable blocks = [];
  @observable nextBlockId = 1;

  constructor({id = String(this.constructor.nextId++), ...props}) {
    Object.assign(this, props, {id});
  }

  @action
  addBlock({id = String(this.nextBlockId++), ...obj}) {
    obj.id = id;
    this.blocks.push(Block.get(obj));
  }

  static get(obj) {
    if (obj instanceof this) {
      return obj;
    }

    return new this(obj);
  }
}

class Block {
  id;
  runingKey;
  resultsRunKey;
  @observable input;
  @observable code;
  @observable config;
  @observable results;
  @observable runError;
  @observable runN = 0;

  constructor(props) {
    Object.assign(this, props);
  }

  @computed
  get codeModule() {
    try {
      return compileModule(transform(this.code));
    } catch(ex) {
      return new Error(ex);
    }
  }
  @computed
  get configMeta() {
    return this.codeModule.config;
  }

  @computed
  get configStr() {
    return JSON.stringify(this.config);
  }
  @computed
  get runKey() {
    return {
      input: this.input,
      code: this.code,
      config: this.configStr,
    };
  }
  isRunKeyValid(runKey) {
    return isEqual(this.runKey, runKey);
  }

  watchResults() {
    return autorun(async () => {
      let added = false;
      try {
        const {codeModule} = this;
        if (codeModule instanceof Error) {
          this.runError = codeModule;
          return;
        }

        const runKey = this.runKey;

        const check = () => isEqual(runKey, this.runingKey) || (this.results && isEqual(this.resultsRunKey, runKey));
        if (check()) {
          return;
        }

        this.runN++;
        added = true;
        console.log('block run runKey', runKey);
        this.runingKey = runKey;
        this.runError = null;


        const {default: run, depends: loadDeps} = codeModule;

        const depends = await loadDeps({load, block: this, config: this.config});
        if (!this.isRunKeyValid(runKey)) {
          return;
        }

        const {ast, results = {}} = run({input: this.input, block: this, config: this.config, depends});
        console.log('block run got', ast, results);

        this.results = {
          ...results,
          ast,
        };
        this.resultsRunKey = runKey;
      } catch(ex) {
        this.runError = ex;
      } finally {
        if (added) {
          this.runN--;
        }
        this.runingKey = null;
      }
    });
  }

  static get(obj) {
    if (obj instanceof this) {
      return obj;
    }

    return new this(obj);
  }
}
