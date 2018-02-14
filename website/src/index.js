import React, {render} from 'common/react';
import {Provider, connectReduxDevtools} from 'common/mobx';

import App from './App';

import './index.css';
import './App.less';

// import registerServiceWorker from './registerServiceWorker';

import {Store} from './store';

let store = Store.create({});
if (process.env.NODE_ENV !== 'production') {
  // TODO: wait mobxjs/mobx-state-tree#506
  // connectReduxDevtools(require('remotedev'), store);
}

const renderApp = process.env.NODE_ENV !== 'production' ?
  function(App, store) {
    const {AppContainer} = require('react-hot-loader');
    render(
      <AppContainer>
        <Provider store={store}>
          <App/>
        </Provider>
      </AppContainer>
      ,
      document.getElementById('root'),
    );
  } : function(App, store) {
    render(
      <Provider store={store}>
        <App/>
      </Provider>,
      document.getElementById('root'),
    );
  };

renderApp(App, store);

// registerServiceWorker();

if (process.env.NODE_ENV !== 'production' && module.hot) {
  // module.hot.accept(["./models/todos"], () => {
  //   // Store definition changed, recreate a new one from old state
  //   renderApp(App, createTodoStore(getSnapshot(store)))
  // })

  module.hot.accept(['./App'], () => {
    renderApp(require('./App').default, store)
  });
}
