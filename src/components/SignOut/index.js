import React, { Component } from 'react'

import { withFirebase } from '../Firebase'
import * as Routes from '../../constants/routes'
import { compose } from 'recompose'
import { withRouter } from 'react-router'

class SignOutButtonBase extends Component{
  constructor(props) {
    super(props)
  }
  
  onClick = () => {
    this.props.firebase.auth.signOut()
    this.props.history.push(Routes.SignIn)
  }

  render() {
    return (
      <button type="button" onClick={this.onClick}>
        Sign Out
      </button>
    )
  }
}

const SignOutButton = compose(
  withRouter,
  withFirebase,
)(SignOutButtonBase)

export default SignOutButton