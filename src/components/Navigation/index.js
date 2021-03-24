import React from 'react'
import { Link } from 'react-router-dom'

import { AuthUserContext } from '../Session'
import SignOutButton from '../SignOut'
import * as Routes from '../../constants/routes'

const NavigationAuth = () => {
  return (
    <ul>
      <li>
        <Link to={Routes.Landing}>Landing</Link>
      </li>
      <li>
        <Link to={Routes.Home}>Home</Link>
      </li>
      <li>
        <Link to={Routes.Account}>Account</Link>
      </li>
      <li>
        <SignOutButton />
      </li>
    </ul>
  )
}

const NavigationNonAuth = () => {
  return (
    <ul>
      <li>
        <Link to={Routes.Landing}>Landing</Link>
      </li>
      <li>
        <Link to={Routes.SignIn}>Sign In</Link>
      </li>
    </ul>
  )
}

const Navigation = ({authUser}) => {
  return (
    <div>
      <AuthUserContext.Consumer>
        { (authUser) => { 
            return (authUser ? <NavigationAuth /> : <NavigationNonAuth />)
          }
        }
      </AuthUserContext.Consumer>
    </div>
  )
}

export default Navigation
