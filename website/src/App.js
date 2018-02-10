import './App.less';

import React, {Component, HashRouter, Route, Redirect} from 'c/react';
import {SvgIcon} from 'c/ui';
import Play from './p/PlayPage';
import {load} from 'c/utils';
import DevTools from 'mobx-react-devtools';


class App extends Component {
  static load = load;

  render() {
    return (
      <HashRouter>
        <div v:class="app">
          <DevTools v:if />

          <Route path="/plays/:id" component={Play} />

          <Redirect from="*" to="/plays/1" />

          <footer>
            Built with React,&nbsp;
            <a href="https://ant.design/docs/react/introduce">Antd</a>, Babel
            &nbsp;|&nbsp;
            <a href="https://github.com/kindy/ast"><SvgIcon icon="github" size={14}/></a>
            &nbsp;|&nbsp;
            See also <a href="https://astexplorer.net/">AST Explorer</a>
          </footer>
        </div>
      </HashRouter>
    );
  }
}

export default App;
