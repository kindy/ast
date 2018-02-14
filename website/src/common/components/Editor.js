import 'codemirror/lib/codemirror.css';
import 'codemirror/addon/fold/foldgutter.css';
import './Editor.less';

import React, {Component, PropTypes, noop} from '../react';
import {observable} from '../mobx';
import {forEach} from '../utils';

import CodeMirror from 'codemirror';

import 'codemirror/addon/fold/foldcode';
import 'codemirror/addon/fold/foldgutter';
import 'codemirror/addon/fold/indent-fold';

import 'codemirror/addon/dialog/dialog.css';
import 'codemirror/addon/dialog/dialog';
import 'codemirror/addon/search/searchcursor';
import 'codemirror/addon/search/search';

import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/jsx/jsx';
import 'codemirror/mode/yaml/yaml';

import 'codemirror/keymap/vim';
import 'codemirror/keymap/sublime';

// hack yaml to support fold by indent
CodeMirror.modes.yaml = (
  origModeF => (...args) =>
    Object.assign(origModeF(...args), {fold: 'indent'})
)(CodeMirror.modes.yaml);

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
    foldGutter: {
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
      type: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
      default: 'jsx',
    },
    keyMap: {
      type: PropTypes.string,
      default: 'sublime',
    },
  };

  static editorProps = [
    'keyMap',
    // 'value',
    'mode',
    'lineNumbers',
    'readOnly',
    'foldGutter',
  ];

  constructor(props) {
    super(props);
    this.state = {
    };

    this.value = props.value;
  }

  getGutters(prop) {
    return ['lineNumbers', 'foldGutter']
      .map(k => ([k, prop[k]]))
      .filter(([k, on]) => Boolean(on))
      .map(([k]) => `CodeMirror-${k.toLowerCase()}`);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.value !== this.value) {
      this.value = nextProps.value;
      this.codeMirror.setValue(nextProps.value);
    }

    let changed = false;
    this.constructor.editorProps.forEach(p => {
      if (nextProps[p] !== this.props[p]) {
        this.codeMirror.setOption(p, nextProps[p]);
        changed = true;
      }
    });
    if (changed) {
      this.codeMirror.setOption('gutters', this.getGutters(nextProps));
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
        value: this.props.value,

        keyMap: this.props.keyMap,
        mode: this.props.mode,
        lineNumbers: this.props.lineNumbers,
        readOnly: this.props.readOnly,
        foldGutter: this.props.foldGutter,
        gutters: this.getGutters(this.props),
      },
    );

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

    this.value = args.value;
    this.props.onContentChange(args);
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
