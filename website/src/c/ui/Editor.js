import 'codemirror/lib/codemirror.css';
import 'codemirror/addon/fold/foldgutter.css';

import React, {Component, PropTypes, noop} from '../react';
import CodeMirror from 'codemirror';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/keymap/vim';
import 'codemirror/keymap/sublime';
import {css} from './base';


css(`
.editor {
  box-shadow: 0 0 2px 0 #ddd;
  margin-right: 3px; 
  height: 300px;
  display: flex;
  flex-direction: column;
  flex: auto;
}
.editor .CodeMirror {
  flex: auto;
}

`);

export default class Editor extends Component {
  static props = {
    value: {
      type: PropTypes.string,
      default: '',
    },
    highlight: {
      type: PropTypes.bool,
      default: true,
    },
    lineNumbers: {
      type: PropTypes.bool,
      default: true,
    },
    readOnly: {
      type: PropTypes.bool,
      default: false,
    },
    onContentChange: {
      type: PropTypes.func,
      default: noop,
    },
    onActivity: {
      type: PropTypes.func,
      default: noop,
    },
    posFromIndex: {
      type: PropTypes.func,
    },
    error: {
      type: PropTypes.object,
    },
    mode: {
      type: PropTypes.string,
      default: 'javascript',
    },
    enableFormatting: {
      type: PropTypes.bool,
    },
    keyMap: {
      type: PropTypes.string,
      default: 'default',
    },
  };

  constructor(props) {
    super(props);
    this.state = {
      value: props.value,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.value !== this.state.value) {
      this.setState(
        {value: nextProps.value},
        () => this.codeMirror.setValue(nextProps.value),
      );
    }
    if (nextProps.mode !== this.props.mode) {
      this.codeMirror.setOption('mode', nextProps.mode);
    }

    if (nextProps.keyMap !== this.props.keyMap) {
      this.codeMirror.setOption('keyMap', nextProps.keyMap);
    }

    this._setError(nextProps.error);
  }

  shouldComponentUpdate() {
    return false;
  }

  getValue() {
    return this.codeMirror && this.codeMirror.getValue();
  }

  _getErrorLine(error) {
    return error.loc ? error.loc.line : (error.lineNumber || error.line);
  }

  _setError(error) {
    if (this.codeMirror) {
      let oldError = this.props.error;
      if (oldError) {
        let lineNumber = this._getErrorLine(oldError);
        if (lineNumber) {
          this.codeMirror.removeLineClass(lineNumber - 1, 'text',
            'errorMarker');
        }
      }

      if (error) {
        let lineNumber = this._getErrorLine(error);
        if (lineNumber) {
          this.codeMirror.addLineClass(lineNumber - 1, 'text', 'errorMarker');
        }
      }
    }
  }

  _posFromIndex(doc, index) {
    return (this.props.posFromIndex ? this.props : doc).posFromIndex(index);
  }

  componentDidMount() {
    this._CMHandlers = [];
    this.codeMirror = CodeMirror( // eslint-disable-line new-cap
      this.container,
      {
        keyMap: this.props.keyMap,
        value: this.state.value,
        mode: this.props.mode,
        lineNumbers: this.props.lineNumbers,
        readOnly: this.props.readOnly,
      },
    );

    this._bindCMHandler('blur', instance => {
      if (!this.props.enableFormatting) return;
    });

    this._bindCMHandler('changes', () => {
      clearTimeout(this._updateTimer);
      this._updateTimer = setTimeout(this._onContentChange.bind(this), 200);
    });
    this._bindCMHandler('cursorActivity', () => {
      clearTimeout(this._updateTimer);
      this._updateTimer = setTimeout(this._onActivity.bind(this, true), 100);
    });

    if (this.props.highlight) {
      this._markerRange = null;
      this._mark = null;
    }

    if (this.props.error) {
      this._setError(this.props.error);
    }
  }

  componentWillUnmount() {
    clearTimeout(this._updateTimer);
    this._unbindHandlers();
    this._markerRange = null;
    this._mark = null;
    let container = this.container;
    container.removeChild(container.children[0]);
    this.codeMirror = null;
  }

  _bindCMHandler(event, handler) {
    this._CMHandlers.push(event, handler);
    this.codeMirror.on(event, handler);
  }

  _unbindHandlers() {
    const cmHandlers = this._CMHandlers;
    for (let i = 0; i < cmHandlers.length; i += 2) {
      this.codeMirror.off(cmHandlers[i], cmHandlers[i + 1]);
    }
  }

  _onContentChange() {
    const doc = this.codeMirror.getDoc();
    const args = {
      value: doc.getValue(),
      cursor: doc.indexFromPos(doc.getCursor()),
    };
    this.setState(
      {value: args.value},
      () => this.props.onContentChange(args),
    );
  }

  _onActivity() {
    this.props.onActivity(
      this.codeMirror.getDoc().indexFromPos(this.codeMirror.getCursor()),
    );
  }

  render() {
    return (
      <div v:class="editor" ref={c => this.container = c}/>
    );
  }
}
