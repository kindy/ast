import React, {Component, PropTypes} from 'c/react';
import {observer} from 'c/mobx';
import {forEach} from 'c/utils';

import {
  Editor,
  Pane, SplitPane,
  SvgIcon,
  Button,
  Tabs, Icon, Menu, Dropdown,
} from 'c/ui';
import {load} from 'c/utils';
const {TabPane} = Tabs;
const {SubMenu} = Menu;


const menu = (
  <Menu>
    <Menu.Item>1st menu item</Menu.Item>
    <Menu.Item>2nd menu item</Menu.Item>
    <SubMenu title="sub menu">
      <Menu.Item>3rd menu item</Menu.Item>
      <Menu.Item>4th menu item</Menu.Item>
    </SubMenu>
    <SubMenu title="disabled sub menu" disabled>
      <Menu.Item>5d menu item</Menu.Item>
      <Menu.Item>6th menu item</Menu.Item>
    </SubMenu>
  </Menu>
);


@observer
export default class Block extends Component {
  static props = {
    block: PropTypes.object,
  };

  constructor(props) {
    super();

    this.state = {
      inKey: 'input',
      outKey: 'json', // TODO: tree
    };

    this.jsonMode = {
      language: 'javascript',
      json: true,
    };
  }

  componentDidMount() {
    this.watchResults(this.props.block);
  }
  componentWillUnmount() {
    this.clearWatch();
  }

  buildJSONViewer(json) {
    return <Editor value={json} mode={this.jsonMode} readOnly={true} />;
  }

  render() {
    const {block} = this.props;
    const {[this.state.inKey]: code, results, runError} = block;

    let out;
    let outTabs;
    if (runError) {
      out = <Editor value={String(runError)} readOnly={true} mode={'text'} />;

    } else if (!results) {
      out = 'no result';

    } else {
      switch (this.state.outKey) {
        case 'tree':
        case 'json':
          out = this.buildJSONViewer(JSON.stringify(results.ast, null, '  '));
          break;
        default:
          out = <Editor value={String(results[this.state.outKey])} readOnly={true} />;
          break;
      }

      const tabs = [];
      const {ast, ...others} = results;
      if (ast) {
        // TODO: tree
        false && tabs.push({
          key: 'tree',
          tab: <SvgIcon icon="tree" />,
        });
        tabs.push({
          key: 'json',
          tab: <SvgIcon icon="json" />,
        });
      }
      if (others) {
        forEach(Object.keys(others), key => {
          tabs.push({
            key,
            tab: <SvgIcon icon="code" />,
          });
        });
      }

      if (tabs.length) {
        outTabs = tabs;
      }
    }

    return <Pane
      title={<React.Fragment>
        <h3>{block.id}</h3>
        <Tabs activeKey={this.state.inKey} size="small"
          tabBarExtraContent={
            <Button v:if icon="setting" size="small"
              v:wrap={<Dropdown overlay={menu} />}
            ></Button>
          }
          onChange={key => this.setState({inKey: key})}
        >
          <TabPane tab={<SvgIcon icon="code" />} key="input"/>
          <TabPane tab={<SvgIcon icon="gearsO" />} key="code"/>
        </Tabs>

        <span v:class="flex"/>

        <Tabs v:if={outTabs} activeKey={this.state.outKey} size="small" v:class="out-tabs"
          onChange={key => this.setState({outKey: key})}
          tabBarExtraContent={
            <Button v:if icon="setting" size="small"></Button>
          }
        >
          {outTabs.map(x => <TabPane {...x} />)}
        </Tabs>

        <Icon v:if={block.runN} icon="loading" />
      </React.Fragment>}
      v:class="flexV flex-auto"
    >
      <SplitPane>
        <Editor
          value={code}
          onContentChange={({value}) => this.props.block[this.state.inKey] = value}
        />

        <div>
          {out}
        </div>
      </SplitPane>
    </Pane>;
  }

  watchResults(block) {
    this._watch = block.watchResults();
  }
  clearWatch() {
    if (this._watch) {
      this._watch();
      this._watch = null;
    }
  }
}
