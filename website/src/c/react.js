import ReactDOM from 'react-dom';
import React, {Component as ReactComponent} from 'react';
import {noop, forEach, isObject, isPlainObject} from 'lodash';

export {BrowserRouter, Router, HashRouter, Route, Link, Redirect} from 'react-router-dom';
export {default as PropTypes} from 'prop-types';

const {Fragment} = React;
const {render} = ReactDOM;
export class Component extends ReactComponent {
  static checkPropCall(ctx) {
    if (ctx === Component) {
      throw new Error('can not run this in Component');
    }
    if (!(ctx.prototype instanceof Component)) {
      throw new Error('this is not sub class of Component');
    }
  }
  static _fillProps() {
    const propTypes = {};
    const defaultProps = {};
    forEach(this.props || {}, (def, prop) => {
      const {type, default: val} = (def && def.type) ? def : {type: def};

      propTypes[prop] = type;
      if (val !== undefined) {
        defaultProps[prop] = val;
      }
    });

    Object.defineProperties(this, {
      propTypes: {
        value: propTypes,
      },
      defaultProps: {
        value: defaultProps,
      },
    });
  }

  static get propTypes() {
    Component.checkPropCall(this);

    this._fillProps();
    return this.propTypes;
  }
  static get defaultProps() {
    Component.checkPropCall(this);

    this._fillProps();
    return this.defaultProps;
  }
}
React._extFixClassName = (function() {
  // vuejs/vue: platforms/web/util/class.js
  function isDef(v) {
    return v !== undefined && v !== null;
  }

  function stringifyArray(value) {
    let res = '';
    let stringified;
    for (let i = 0, l = value.length; i < l; i++) {
      if (isDef(stringified = stringifyClass(value[i])) && stringified !== '') {
        if (res) res += ' ';
        res += stringified;
      }
    }
    return res;
  }

  function stringifyObject(value) {
    let res = '';
    for (const key in value) {
      if (value[key]) {
        if (res) res += ' ';
        res += key;
      }
    }
    return res;
  }

  function stringifyClass(value) {
    if (Array.isArray(value)) {
      return stringifyArray(value);
    }
    if (isObject(value)) {
      return stringifyObject(value);
    }
    if (typeof value === 'string') {
      return value;
    }
    /* istanbul ignore next */
    return '';
  }

  return stringifyClass;
})();


export {render, React as default, noop, Fragment};
