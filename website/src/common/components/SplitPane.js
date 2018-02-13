import './SplitPane.less';

import React, {Component, PropTypes} from '../react';

export default class SplitPane extends Component {
  static props = {
    vertical: PropTypes.bool,
    className: {
      type: PropTypes.string,
    },
    children: PropTypes.node,
    onResize: PropTypes.func,
  };

  constructor(props, context) {
    super(props, context);
    this._onMouseDown = this._onMouseDown.bind(this);

    this.state = {
      dividerPosition: 50,
    };
  }

  _onMouseDown(ev) {
    console.log('mousedown', ev.button, ev.buttons);
    if (ev.button !== 0) {
      return;
    }

    let {vertical} = this.props;
    let max = vertical ? global.innerHeight : global.innerWidth;
    global.document.body.style.cursor = vertical ? 'row-resize' : 'col-resize';

    let moveHandler = event => {
      event.preventDefault();
      this.setState({
        dividerPosition: ((vertical ? event.pageY : event.pageX) / max) * 100});
    };
    let upHandler = () => {
      document.removeEventListener('mousemove', moveHandler);
      document.removeEventListener('mouseup', upHandler);
      global.document.body.style.cursor = '';

      if (this.props.onResize) {
        this.props.onResize();
      }
    };

    document.addEventListener('mousemove', moveHandler);
    document.addEventListener('mouseup', upHandler);
  }

  render() {
    let {children, className, vertical} = this.props;
    let dividerPos = this.state.dividerPosition;
    let styleA;
    let styleB;
    let dividerStyle;

    const topClass = ['splitpane', className];

    vertical && topClass.push('vertical');

    if (!Array.isArray(children) || children.filter(x => x).length !== 2) {
      topClass.push('split-off');

      return (
        <div v:class={topClass}>
          <div v:class="splitpane--all">
            {this.props.children}
          </div>
        </div>
      );
    }

    topClass.push('split-on');

    if (vertical) {
      // top
      styleA = {
        top: 0,
        height: dividerPos + '%',
        paddingBottom: 3,
      };
      // bottom
      styleB = {
        bottom: 0,
        height: (100 - dividerPos) + '%',
        paddingTop: 3,
      };
      dividerStyle = {
        top: dividerPos + '%',
      };
    } else {
      // left
      styleA = {
        left: 0,
        width: dividerPos + '%',
        paddingRight: 3,
      };
      // right
      styleB = {
        right: 0,
        width: (100 - dividerPos) + '%',
        paddingLeft: 3,
      };
      dividerStyle = {
        left: dividerPos + '%',
      };
    }

    return (
      <div v:class={topClass}>
        <div v:class="splitpane--content splitpane--a" style={styleA}>
          {this.props.children[0]}
        </div>
        <div v:class="splitpane--content splitpane--divider" style={dividerStyle}
          onMouseDown={this._onMouseDown}
        />
        <div v:class="splitpane--content splitpane--b" style={styleB}>
          {this.props.children[1]}
        </div>
      </div>
    );
  }
}
