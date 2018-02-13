import React, {Component, PropTypes} from 'common/react';

import {observer, inject} from 'common/mobx';
import {Button} from 'common/components';
import Block from './Block';


class Play extends Component {
  static props = {
    play: PropTypes.object,
  };

  constructor(props) {
    super();

    this.state = {};
  }

  render() {
    const {play} = this.props;
    const {blocks} = play;

    return <div>
      <div v:if={!blocks || !blocks.length} style={{textAlign: 'center', marginTop: '3em'}}>
        <h3>No Blocks, how about add one?</h3>
        <div style={{margin: '1em 0'}}>
          <Button type="primary"
            onClick={() => play.addBlock()}>+Block</Button>
        </div>
        <div>
          {this.props.store.play.samples.map(s => (
            <Button onClick={() => play.addSampleBlock(s)} style={{margin: '0 0.3em'}}>+{s}</Button>
          ))}
        </div>
      </div>

      {blocks.map(block => <Block block={block} key={block.id}/>)}
    </div>;
  }
}

export default inject('store')(observer(Play));
