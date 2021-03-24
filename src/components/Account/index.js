import React from 'react'

import { AuthUserContext, withAuthorization } from '../Session'
import PasswordChangeForm from '../PasswordChange'
import { PasswordForgetForm } from '../PasswordForget'

const AccountPage = () => {
  return (
    <AuthUserContext.Consumer>
      { (authUser) => {
        return (
          <div>
            <h1>Account: { authUser.email }</h1>
            <PasswordForgetForm />
            <PasswordChangeForm />
          </div>
        )}}
    </AuthUserContext.Consumer>
  )
}

const condition = (authUser) => !!authUser

export default withAuthorization(condition)(AccountPage)