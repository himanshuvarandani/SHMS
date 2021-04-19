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
          } else if (this.props.match.path === "/doctor/:uid") {
            this.props.firebase
              .user(authUser.uid)
              .on("value", (snapshot) => {
                if (snapshot.val()) {
                  if (snapshot.val().type === "Patient") {
                    this.props.history.push(Routes.Error)
                  } else if (this.props.match.params.uid !== authUser.uid) {
                    this.props.history.push(Routes.Error)
                  }
                } else {
                  this.props.history.push(Routes.Error)
                }
              })
          } else if (this.props.match.path === "/patient/:uid") {
            this.props.firebase
              .user(authUser.uid)
              .on("value", (snapshot) => {
                if (snapshot.val()) {
                  if (snapshot.val().type === "Doctor") {
                    if (snapshot.val().patients) {
                      if (!snapshot.val().patients[this.props.match.params.uid]) {
                        this.props.history.push(Routes.Error)
                      }
                    } else {
                      this.props.history.push(Routes.Error)
                    }
                  } else if (this.props.match.params.uid !== authUser.uid) {
                    this.props.history.push(Routes.Error)
                  }
                } else {
                  this.props.history.push(Routes.Error)
                } 
              })
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
