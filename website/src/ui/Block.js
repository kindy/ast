import './Block.less';

import React, {Component, PropTypes, Fragment} from 'c/react';
import {observer} from 'c/mobx';
import {forEach} from 'c/utils';

import {
  Editor,
  Pane, SplitPane,
  SvgIcon,
  Button, Spin,
  Tabs, Icon, Menu, Dropdown,
} from 'c/ui';
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


export class Block extends Component {
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
      name: 'javascript',
      json: true,
    };
  }

  componentDidMount() {
  }
  componentWillUnmount() {
  }
  onCodeChange(code) {
    this.props.block.doUpdate({
      [this.state.inKey]: code,
    })
  }

  buildJSONViewer(json) {
    return <Editor value={json} mode={this.jsonMode} readOnly={true} />;
  }

  render() {
    const {block} = this.props;
    const {inKey, outKey} = this.state;
    const {[inKey]: code, results, runError} = block;

    let out;
    let outTabs;
    if (runError) {
      out = <Editor value={String(runError)} readOnly={true} mode={'text'} />;

    } else if (!results) {
      out = block.running ? '' : 'no result';

    } else {
      switch (outKey) {
        case 'tree':
        case 'json':
          out = this.buildJSONViewer(JSON.stringify(results.ast, null, '  '));
          if (outKey === 'tree') {
            out = <Fragment>
              <div><em>TODO: Render Tree</em></div>
              {out}
            </Fragment>;
          }
          break;
        default:
          out = <Editor value={String(results[outKey])} readOnly={true} />;
          break;
      }

      const tabs = [];
      const {ast, ...others} = results;
      if (ast) {
        // TODO: tree
        tabs.push({
          key: 'tree',
          tab: 'Tree',
        });
        tabs.push({
          key: 'json',
          tab: 'JSON',
        });
      }
      if (others) {
        forEach(Object.keys(others), key => {
          tabs.push({
            key,
            tab: <Fragment><SvgIcon icon="code" />{key}</Fragment>,
          });
        });
      }

      if (tabs.length) {
        outTabs = tabs;
      }
    }

    return <div className="pane block--pane">
      <SplitPane>
        <Fragment>
          <div className="pane--title">
            <h3>Block#{block.id}</h3>
            <Tabs activeKey={this.state.inKey} size="small"
              tabBarExtraContent={
                <Button v:if icon="setting" size="small"
                  v:wrap={<Dropdown overlay={menu} />}
                ></Button>
              }
              onChange={key => this.setState({inKey: key})}
            >
              <TabPane tab={<Fragment><SvgIcon icon="code" />Input</Fragment>} key="input"/>
              <TabPane tab={<Fragment><SvgIcon icon="gearsO" />Code</Fragment>} key="code"/>
            </Tabs>
            <span v:class="flex"/>
          </div>
          <div className="pane--body">
            <Editor
              value={code}
              onContentChange={({value}) => this.onCodeChange(value)}
            />
          </div>
        </Fragment>

        <Fragment>
          <div className="pane--title">
            <h3>OUTPUT</h3>
            <Tabs v:if={outTabs} activeKey={outKey} size="small" v:class="out-tabs"
              onChange={key => this.setState({outKey: key})}
              tabBarExtraContent={
                <Button v:if icon="setting" size="small"></Button>
              }
            >
              {outTabs.map(x => <TabPane {...x} />)}
            </Tabs>
            <span v:class="flex"/>
          </div>

          <div className="pane--body">
            <div v:class="loading-dot"><Spin spinning={block.running} delay={200} /></div>

            {out}
          </div>
        </Fragment>
      </SplitPane>
    </div>;
  }
}

export default observer(Block);
