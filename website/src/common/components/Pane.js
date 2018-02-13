import './Pane.less';

import React, {Component, PropTypes} from '../react';


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
