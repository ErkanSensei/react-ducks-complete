module.exports = `import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import Home from './containers/Home;

class App extends Component {
  render() {
    return (
      <React.Fragment>
          <Switch>
            <Route path="/" component={Home} />
          </Switch>
      </React.Fragment>
    );
  }
}

export default App;
`;