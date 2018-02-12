import './PlayPage.less';

import React, {Component, Fragment} from 'c/react';
import {observer, inject} from 'c/mobx';
import Play from '../ui/Play';
import {Tabs, Button, Menu, Dropdown, Icon} from 'c/ui';
const {TabPane} = Tabs;


export class PlayPage extends Component {
  constructor(props) {
    super(props);

    this.playStore = this.store.play;

    this.state = {
    };

    this.playStore.setPlayId(this.getPlayId(props));
  }

  componentDidMount() {
    this.addPlay();
  }
  componentWillReceiveProps(props) {
    this.playStore.setPlayId(this.getPlayId(props));
  }

  addPlay(obj = {}) {
    this.playStore.addPlay(obj);
  }

  get plays() {
    return this.playStore.plays.values();
  }
  get curPlay() {
    return this.playStore.curPlay;
  }

  getPlayId(props = this.props) {
    return props.match.params.id;
  }

  doClickMenu(type) {
    switch (type) {
      case 'addSample':
        this.addSampleBlock();
        break;
    }
  }

  addSampleBlock() {
    this.curPlay.addSampleBlock();
  }

  addBlock() {
    this.curPlay.addBlock({});
  }

  render() {
    const {plays, curPlay: play} = this;
    const playId = this.playStore.activeId;

    const menu = (
      <Menu onClick={ev => this.doClickMenu(ev.key)}>
        <Menu.Item key="addSample">+Sample Block</Menu.Item>
      </Menu>
    );

    return <Fragment>
      <header>
        <h1>AST Play</h1>

        <Tabs type="card" activeKey={playId}
          tabBarExtraContent={
            <Button size="small" ghost type="primary"
              onClick={() => this.addPlay()}>+Play</Button>
          }
          onChange={key => this.playStore.setPlayId(key)}
        >
          {plays.map(play => <TabPane tab={`Play#${play.id}`} key={play.id} />)}
        </Tabs>
        <span className="flex-auto"></span>

        <div v:class="play-toolbar">
          <Button.Group>
            <Button size="small" type="primary"
              onClick={() => this.addBlock()}>+Block</Button>
            <Button size="small" type="primary" v:class="drop-btn-arrow"
              v:wrap={<Dropdown overlay={menu} />}
            >
              <Icon type="down"/>
            </Button>
          </Button.Group>
        </div>
      </header>

      <div v:class="mainBody">
        <div v:if={!play}>
          <Button >+Play</Button>
        </div>

        <Fragment v:if={play}>
          <Play play={play} />
        </Fragment>
      </div>
    </Fragment>;
  }
}

export default inject('store')(observer(PlayPage));
