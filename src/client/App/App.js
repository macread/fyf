import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import './App.css';

import SignUp from '../components/SignUp';
import SignIn from '../components/SignIn';
import Album from '../components/Album';
import 'typeface-roboto';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Switch>
          <Route path='/' component={SignUp} exact />
          <Route path='/signin' component={SignIn} />
          <Route path='/album' component={Album} />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;