import React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'

import AccountPage from '../Account'
import AdminPage from '../Admin'
import DoctorPage from '../Doctor'
import ErrorPage from '../Error'
import LandingPage from '../Landing'
import Navigation from '../Navigation'
import PatientPage from '../Patient'
import PasswordForgetPage from '../PasswordForget'
import SignInPage from '../SignIn'
import SignUpPage from '../SignUp'
import { withAuthentication } from '../Session'

import * as Routes from '../../constants/routes'

const App = () => (
  <Router>
    <div>
      <Navigation/>

      <hr />

      <Route exact path={Routes.Landing} component={LandingPage} />
      <Route path={Routes.Doctor+"/:uid"} component={DoctorPage} />
      <Route path={Routes.Patient+"/:uid"} component={PatientPage} />
      <Route path={Routes.SignIn} component={SignInPage} />
      <Route path={Routes.SignUp} component={SignUpPage} />
      <Route path={Routes.PasswordForget} component={PasswordForgetPage} />
      <Route path={Routes.Account} component={AccountPage} />
      <Route path={Routes.Admin} component={AdminPage} />
      <Route path={Routes.Error} component={ErrorPage} />
    </div>
  </Router>
)

export default withAuthentication(App)