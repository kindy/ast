import {observable, computed, autorun} from 'c/mobx';
import remotedev from 'mobx-remotedev';

import PlayStore from './PlayStore';


class Store {
  @observable play = new PlayStore();
}

export const store = new Store();


export default remotedev(store);
