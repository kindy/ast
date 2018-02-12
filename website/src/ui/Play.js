import React, {Component, PropTypes} from 'c/react';

import {observer} from 'c/mobx';
import Block from './Block';


@observer
export default class Play extends Component {
  static props = {
    play: PropTypes.object,
  };

  constructor(props) {
    super();

    this.state = {};
  }

  render() {
    const {play} = this.props;

    return <div>
      {play.blocks.map(block => <Block block={block} key={block.id}/>)}
    </div>;
  }
}