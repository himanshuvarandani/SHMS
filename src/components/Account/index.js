import React from 'react'
import { compose } from 'recompose'

import './Account.css'

import { AuthUserContext, withAuthorization } from '../Session'
import PasswordChangeForm from '../PasswordChange'
import { PasswordForgetForm } from '../PasswordForget'
import { withFirebase } from '../Firebase'

const AccountPageBase = (props) => {
  const [loading, setLoading] = React.useState(true)
  const [username, setUsername] = React.useState()

  React.useEffect(() => {
    props.firebase
      .user(props.match.params.uid)
      .once("value")
      .then((snapshot) => {
        setUsername(snapshot.val().username)
        setLoading(false)
      })
  }, [])

  return (
    <AuthUserContext.Consumer>
      { (authUser) => {
        return (
          <div className="container account">
            < br />
            <h1 className="text-center">User: { !loading ? username : "Loading ..." }</h1>
            < br />
            
            <PasswordForgetForm />
            <PasswordChangeForm />
          </div>
        )
      }}
    </AuthUserContext.Consumer>
  )
}

const condition = (authUser) => !!authUser

const AccountPage = compose(
  withAuthorization(condition),
  withFirebase
)(AccountPageBase)

export default AccountPage