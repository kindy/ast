import React, {Component, PropTypes, noop} from '../react';
import {css} from './base';


css(`
.pane {
  box-shadow: 0 0 2px 0 #ddd;
  border-radius: 4px 4px 0 0;
  margin-bottom: 1em;
}

.pane--title {
  display: flex;
  align-items: flex-end;
  background: #eee;
  padding-left: 1em;
}
.pane--title h3 {
  margin: 0 .5em 5px 0;
}

.pane--title .ant-tabs-bar {
  margin-bottom: 0;
}
.pane--title .ant-tabs-extra-content {
  line-height: 32px;
  margin-top: 2px;
}

.pane--title > span.flex {
  flex: auto;
  /*display: flex;*/
  /*align-items: flex-end;*/
}
.pane--title .ant-tabs-nav .ant-tabs-tab {
  margin-right: 5px;
}

.pane--body {
  height: 300px;
  position: relative;
}

`);

export default class Pane extends Component {
  static props = {
    title: PropTypes.node,
    className: PropTypes.string,
  };

  render() {
    const {title, className} = this.props;

    return <div v:class={['pane', className]}>
      <div v:class="pane--title" v:if={title}>{title}</div>
      <div className="pane--body">
        {this.props.children}
      </div>
    </div>;
  }
}
