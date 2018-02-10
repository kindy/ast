import React, {Component, Fragment} from 'c/react';
import {find} from 'c/utils';
import Play from '../ui/Play';
import store from '../s';
import {Tabs, SvgIcon, Button, css} from 'c/ui';
const {TabPane} = Tabs;


css(`
.play-toolbar {
  position: relative;
  top: -11px;
  margin: 0 -8px;
  background: rgba(242, 242, 242, 0.5019607843137255);
  padding: 3px 8px;
  text-align: right;
}

`);

export default class PlayPage extends Component {
  constructor(props) {
    super(props);

    this.store = store;
    this.playStore = store.play;

    this.state = {
    };
  }

  componentDidMount() {
    this.playStore.addPlay({id: '1'});
  }
  componentDidUpdate() {
    if (this.curPlay && !this.curPlay.blocks.length) {
      this.addBlock();
    }
  }

  get plays() {
    return this.playStore.plays;
  }
  get playId() {
    return this.props.match.params.id;
  }
  get curPlay() {
    return find(this.plays, {id: this.playId});
  }

  addBlock() {
    const input = `<a><b v:if={a} /></a>`.trim();
    const code = `
const options = (x = []) => ({
  ast: true,
  babelrc: false,
  plugins: [
    ...x,
    'syntax-jsx',
  ],
});

export default function({input, block, config, depends: {babel, v}}) {
  const {ast, code: out} = babel.transform(input, options([v]));

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
  ]).then(([babel, v]) => ({babel, v}));
};

export const config = {};
    `.trim();
    this.curPlay.addBlock({input, code,});
  }

  render() {
    const {plays, playId, curPlay: play} = this;

    return <Fragment>
      <header>
        <h1>AST Play</h1>

        <Tabs type="card" activeKey={playId}>
          {plays.map(play => <TabPane tab={`Play#${play.id}`} key={play.id} />)}
        </Tabs>
      </header>

      <div v:class="mainBody">
        <div v:if={!play}>No Play</div>

        <Fragment v:if={play}>
          <div v:class="play-toolbar">
            <Button onClick={() => this.addBlock()}>+Block</Button>
          </div>

          <Play play={play} />
        </Fragment>
      </div>
    </Fragment>;
  }
}
