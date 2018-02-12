import React, {render} from 'c/react';
import {Provider, connectReduxDevtools} from 'c/mobx';

import App from './App';

import './index.css';
import './App.less';

import registerServiceWorker from './registerServiceWorker';

import {Store} from './s';

let store = Store.create({});
if (true) {
  connectReduxDevtools(require('remotedev'), store);
}

render(
  <Provider store={store}>
    <App/>
  </Provider>,
  document.getElementById('root'),
);

registerServiceWorker();
