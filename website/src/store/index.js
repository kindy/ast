import {types, useStrict} from 'common/mobx';

import {PlayStore} from './PlayStore';

useStrict(true);

let Store = types.model('Store', {
  play: types.optional(PlayStore, {
    plays: {},
  }),
  // auth: types.optional(types.object, {}),
  // user: types.optional(types.object, {}),
});

export {Store};
