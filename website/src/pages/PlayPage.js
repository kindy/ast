import './PlayPage.less';

import React, {Component, Fragment} from 'common/react';
import {observer, inject} from 'common/mobx';
import {ga} from 'common/utils';
import Play from '../components/Play';
import {Tabs, Button, Menu, Dropdown, Icon} from 'common/components';
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

  doAddSampleBlock(id) {
    this.curPlay.addSampleBlock(id);
  }

  addBlock() {
    this.curPlay.addBlock();
  }

  render() {
    const {plays, curPlay: play} = this;
    const {activeId, samples} = this.playStore;

    const menu = (
      <Menu onClick={ev => (ga('send', 'event', 'play', 'addBlock', `sample: ${ev.key}`), this.doAddSampleBlock(ev.key))}>
        {samples.map(s => <Menu.Item key={s}>+{s}</Menu.Item>)}
      </Menu>
    );

    return <Fragment>
      <header>
        <h1>AST Play</h1>

        <Tabs type="card" activeKey={activeId}
          tabBarExtraContent={
            <Button size="small" ghost type="primary"
              onClick={() => (ga('send', 'event', 'playPage', 'addPlay'), this.addPlay())}>+Play</Button>
          }
          onChange={key => (ga('send', 'event', 'playPage', 'goPlay', key), this.playStore.setPlayId(key))}
        >
          {plays.map(play => <TabPane tab={`Play#${play.id}`} key={play.id} />)}
        </Tabs>
        <span className="flex-auto"></span>

        <div v:class="play-toolbar">
          <Button.Group>
            <Button size="small" type="primary"
              onClick={() => (ga('send', 'event', 'playPage', 'addBlock', 'default'), this.addBlock())}>+Block</Button>
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
