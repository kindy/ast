import React, {Component, PropTypes} from 'c/react';

import {Editor, Pane, SplitPane, Tabs, Icon, Menu, Dropdown} from 'c/ui';
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


export default class Block extends Component {
  static props = {
    data: PropTypes.object,
  };

  constructor(props) {
    super();

    this.state = {
      inKey: 'source',
      outKey: 'tree',
    };
  }

  render() {
    const {data} = this.props;

    return <Pane
      title={<React.Fragment>
        <h3>{data.id}</h3>
        <Tabs activeKey={this.state.inKey} size="small"
          tabBarExtraContent={
            <Icon
              v:wrap={<Dropdown overlay={menu} />}
              type="plus" />
          }
          onChange={key => this.setState({inKey: key})}
        >
          <TabPane tab="Source" key="source"/>
          <TabPane tab="Trans Code" key="code"/>
        </Tabs>

        <span v:class="flex"/>

        <Tabs activeKey={this.state.outKey} size="small" v:class="out-tabs"
          onChange={key => this.setState({outKey: key})}
        >
          <TabPane tab="Tree" key="tree"/>
          <TabPane tab="JSON" key="json"/>
          <TabPane tab="OUT" key="out"/>
        </Tabs>
      </React.Fragment>}
      v:class="flexV flex-auto"
    >
      <SplitPane>
        <Editor value={`// code for ${this.state.inKey}\n`} />

        <div>
          {this.state.outKey}
        </div>
      </SplitPane>
    </Pane>;
  }
}
