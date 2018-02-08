import './App.less';

import React, {Component} from 'c/react';
import {Tabs} from 'c/ui';
import Block from './ui/Block';
import {load} from 'c/utils';

const {TabPane} = Tabs;

class App extends Component {
  constructor(props) {
    super(props);
    this.load = load;

    this.state = {
      plays: [
        {
          blocks: [
            {
              id: '#1',
            },
            {
              id: '#2',
            },
          ],
        },
      ],

      playIdx: 0,
    };
  }

  render() {
    const {playIdx, plays: {[playIdx]: curPlay}} = this.state;

    return (
      <div v:class="app">
        <header>
          <h1>AST Play</h1>

          <Tabs type="card" activeKey={String(this.state.playIdx)}>
            {this.state.plays.map((play, idx) => <TabPane tab={`Play#${idx + 1}`} key={String(idx)} />)}
          </Tabs>
        </header>

        <div v:class="mainBody">
          <div>
            {curPlay.blocks.map(bl => <Block data={bl} />)}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
