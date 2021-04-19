import React, { Component } from 'react';
import './App.css';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import Main from './components/Main';

// App Component
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <Provider store={store}>
        <BrowserRouter>
          <div>
            {/* App Component Has a Child Component called Main */}
            <Main />
          </div>
        </BrowserRouter>
      </Provider>
    );
  }
}
// Export the App component so that it can be used in index.js
export default App;
