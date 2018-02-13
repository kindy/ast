import {types, destroy} from 'common/mobx';
import {Block, SampleBlocks} from './Block';


export const Play = types.model('Play', {
  id: types.identifier(),
  nextBlockId: types.optional(types.number, 1),
  blocks: types.optional(types.array(Block), []),
}).actions(self => {

  return {
    addBlock(obj = {}) {
      if (!obj.id) {
        obj.id = String(self.nextBlockId++);
      }

      self.blocks.push(obj);
    },

    addSampleBlock(id) {
      const block = SampleBlocks.getBlock(id);

      self.addBlock({
        ...block,
        name: id,
      });
    },

    removeBlock(block) {
      destroy(block);
    },
  };
});


export const PlayStore = types.model('PlayStore', {
  plays: types.map(Play),
  opened: types.optional(types.array(Play), []),
  activeId: types.optional(types.string, ''),
  samples: types.optional(types.array(types.string), SampleBlocks.getIds()),
}).views(self => ({
  get curPlay() {
    return self.plays.get(self.activeId);
  },

})).actions(self => {
  let nextPlayId = 1;

  return {
    addPlay(obj = {}) {
      if (!obj.id) {
        obj.id = String(nextPlayId++);
      }

      self.plays.put(obj);
    },

    setPlayId(id) {
      self.activeId = id;
    },

  };
});
