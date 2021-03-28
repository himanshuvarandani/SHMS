import React from 'react'
import { compose } from 'recompose'
import { withRouter } from 'react-router-dom'

import AuthUserContext from './context'
import { withFirebase } from '../Firebase'
import * as Routes from '../../constants/routes'

const withAuthorization = (condition) => (Component) => {
  class withAuthorization extends React.Component {
    componentDidMount() {
      this.listener = this.props.firebase.auth.onAuthStateChanged(
        (authUser) => {
          if (!condition(authUser)) {
            if (this.props.history.location.pathname === "/signin" || this.props.history.location.pathname === "/signup") {
              this.props.history.goBack()
            } else {
              this.props.history.push(Routes.SignIn)
            }
          }
        }
      )
    }

    componentWillUnmount() {
      this.listener()
    }

    render() {
      return (
        <AuthUserContext.Consumer>
          { (authUser) => condition(authUser) ? <Component { ...this.props } /> : null }
        </AuthUserContext.Consumer>
      )
    }
  }

  return compose(
    withRouter,
    withFirebase
  )(withAuthorization)
}

export default withAuthorization
