import React, {Component, HashRouter, Route, Redirect} from 'c/react';
import {SvgIcon} from 'c/ui';
import Play from './p/PlayPage';
import DevTools from 'mobx-react-devtools';


export class App extends Component {
  render() {
    return <HashRouter>
      <div v:class="app">
        <DevTools />

        <Route path="/plays/:id" component={Play}/>

        <Redirect from="*" to="/plays/1"/>

        <footer>
          Built with React,&nbsp;
          <a href="https://mobx.js.org/">MobX</a>,&nbsp;
          <a href="https://ant.design/docs/react/introduce">Antd</a>
          &nbsp;|&nbsp;
          <a href="https://github.com/kindy/ast"><SvgIcon icon="github"
            size={14}/></a>
          &nbsp;|&nbsp;
          See also <a href="https://astexplorer.net/">AST Explorer</a>
        </footer>
      </div>
    </HashRouter>;
  }
}

export default App;
