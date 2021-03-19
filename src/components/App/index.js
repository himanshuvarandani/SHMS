import React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'

import AccountPage from '../Account'
import AdminPage from '../Admin'
import HomePage from '../Home'
import LandingPage from '../Landing'
import Navigation from '../Navigation'
import PasswordForgetPage from '../PasswordForget'
import SignInPage from '../SignIn'
import SignUpPage from '../SignUp'

import * as Routes from '../../constants/routes'

const App = () => (
  <Router>
    <div>
      <Navigation />

      <hr />

      <Route exact path={Routes.Landing} component={LandingPage} />
      <Route path={Routes.Home} component={HomePage} />
      <Route path={Routes.SignIn} component={SignInPage} />
      <Route path={Routes.SignUp} component={SignUpPage} />
      <Route path={Routes.PasswordForget} component={PasswordForgetPage} />
      <Route path={Routes.Account} component={AccountPage} />
      <Route path={Routes.Admin} component={AdminPage} />
    </div>
  </Router>
)

export default App