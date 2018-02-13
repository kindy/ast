import './Block.less';

import React, {Component, PropTypes, Fragment} from 'common/react';
import {observer} from 'common/mobx';
import {forEach, safeStringify, yaml} from 'common/utils';

import {
  Editor,
  Pane, SplitPane,
  SvgIcon,
  Button, Spin,
  Tabs, Icon, Menu, Dropdown,
} from 'common/components';
const {TabPane} = Tabs;
const {SubMenu} = Menu;


export class Block extends Component {
  static props = {
    block: PropTypes.object,
  };

  constructor(props) {
    super();

    this.state = {
      inKey: 'input',
      outKey: 'ast',
    };

    this.astMode = {
      name: 'yaml',
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

  renderASTtoYaml(ast) {
    return yaml.safeDump(ast, {
      skipInvalid: true,
      noCompatMode: true,
      lineWidth: 1000,
      // noRefs: true,
    });
    // remove all &ref_000
    // .replace(/(^|\n)\s*&ref_\d+\s*($|\n)/g, '$1')
    // .replace(/((?:^|\n)\s*- )&ref_\d+\s*\n\s*/g, '$1')
    // ;
  }

  resetInput() {
    this.props.block.resetInput();
  }
  remove(block) {
    block.remove();
  }

  buildASTViewer(ast) {
    const code = this.renderASTtoYaml(ast);
    return <Editor value={code} mode={this.astMode} readOnly={true} />;
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
        case 'ast':
          out = this.buildASTViewer(results.ast);
          break;
        default:
          out = <Editor value={String(results[outKey])} readOnly={true} />;
          break;
      }

      const tabs = [];
      const {ast, ...others} = results;
      if (ast !== undefined) {
        tabs.push({
          key: 'ast',
          tab: 'AST',
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
            <h3>#{block.id} {block.name || 'Block'}</h3>
            <Tabs activeKey={inKey} size="small"
              onChange={key => this.setState({inKey: key})}
            >
              <TabPane tab={<Fragment><SvgIcon icon="code" />Input</Fragment>} key="input"/>
              <TabPane tab={<Fragment><SvgIcon icon="gearsO" />Code</Fragment>} key="code"/>
            </Tabs>
            <span v:class="flex"/>
            <div v:class="toolbar">
              <Button size="small" v:if>x</Button>
              <Button size="small" v:if={inKey === 'input'}
                onClick={() => this.resetInput()}
              >Reset</Button>
              <Button v:if icon="setting" size="small"></Button>
            </div>
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
            <div v:class="toolbar">
              <Button size="small"
                onClick={() => this.remove(block)}
              >x</Button>
            </div>
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
