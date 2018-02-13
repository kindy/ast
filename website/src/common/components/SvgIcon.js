import React, {Component, PropTypes} from '../react';
import {isString, isObject} from 'lodash';
import * as svgPaths from './svgPath';


export default class SvgIcon extends Component {
  static SIZE = 24;
  static FILL_COLOR = 'currentColor';

  static props = {
    /*
    path="circle black, close white"
     */
    icon: PropTypes.string,
    pathDef: PropTypes.object,
    style: PropTypes.object,
    svgStyle: PropTypes.object,
    className: PropTypes.string,
    onClick: PropTypes.func,

    // size: s, l, xl, = (最大尺寸 path )
    size: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
  };

  // @return Array<{path, box, width, height, name, fillColor}>
  static normalizePaths(icon, pathDef = {}) {
    const re = /(\S+)(?:\s+(\S+))?(?:,\s*|$)/g;

    const paths = [];

    let m;
    while ((m = re.exec(icon)) !== null) {
      const [_$, name, fillColor = this.FILL_COLOR] = m;
      let {[name]: pathObj = svgPaths[name]} = pathDef;

      if (isString(pathObj)) {
        pathObj = {
          path: pathObj,
        };
      } else if (!isObject(pathObj)) {
        throw new Error(`invalid icon name "${name}", in ${icon}`);
      }

      const size = this.getSize(pathObj);

      paths.push({
        ...pathObj,
        ...size,
        fillColor,
        name,
      });
    }

    return paths;
  }

  static getSize(svg) {
    const {box = this.SIZE, size = box} = svg;
    const m = String(size).match(/^(\d+)(?:x(\d+))?$/);
    const [$, width, height = width] = m;

    return {
      width,
      height,
      box,
    };
  }

  // @return {paths, svgProps}
  makePathsProps(svg) {
    const {size = this.constructor.SIZE, icon, pathDef} = this.props;
    const asRaw = size === '=';
    let $box = 0;
    let $width = 0;
    let $height = 0;

    let paths = this.constructor.normalizePaths(icon, pathDef);
    paths = paths.map(({path, box, width, height, name, fillColor: fill}) => {
      $box = Math.max(box, $box);
      $width = Math.max(width, $width);
      $height = Math.max(height, $height);

      const pathProps = {
        key: name,
        d: path,
        fill,
      };
      if (!asRaw) {
        pathProps.transform = `translate(${(box - width) / 2} ${(box - height) / 2})`;
      }
      // TODO: zoom
      // TODO: alignment?

      return pathProps;
    });

    // TODO: asRaw 的时候将 $width 缩放到 不超过 size
    const viewBox = `0 0 ${asRaw ? $width : $box} ${asRaw ? $height : $box}`;
    const svgSize = {
      width: asRaw ? $width : size,
      height: asRaw ? $height : size,
    };
    const svgProps = {
      viewBox,
      ...svgSize,
    };

    return {
      paths,
      svgProps,
    };
  }

  render() {
    let {paths, svgProps} = this.makePathsProps();

    const style = {
      display: 'inline-block',
      ...(this.props.style || {}),
    };
    const svgStyle = {
      display: 'block',
      ...(this.props.svgStyle || {}),
    };
    svgProps = {
      style: svgStyle,
      xmlns: 'http://www.w3.org/2000/svg',
      ...svgProps,
    };
    let spanProps = {
      style,
    };
    if (this.props.onClick) {
      spanProps.onClick = this.props.onClick;
    }
    spanProps.className = ['svg-icon', this.props.className].filter(x => x).join(' ');

    return <span {...spanProps}><svg {...svgProps}>
      {paths.map(path => <path {...path} />)}
    </svg></span>;
  }
}
