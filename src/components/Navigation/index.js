import React from 'react'
import { Link } from 'react-router-dom'

import { AuthUserContext } from '../Session'
import SignOutButton from '../SignOut'
import { withFirebase } from '../Firebase'

import * as Routes from '../../constants/routes'

const NavigationAuth = (props) => {
  const [type, setType] = React.useState("")
  React.useEffect(() => {
    props.firebase
      .user(props.uid)
      .once("value")
      .then((snapshot) => setType(snapshot.val().type))
  })

  return (
    <ul>
      <li>
        <Link to={Routes.Landing}>Landing</Link>
      </li>
      { type === "Doctor" ? (
        <li>
          <Link to={Routes.Doctor+"/"+props.uid}>Home</Link>
        </li>
      ) : (
        <li>
          <Link to={Routes.Patient+"/"+props.uid}>Home</Link>
        </li>
      )}
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

const Navigation = (props) => {
  return (
    <div>
      <AuthUserContext.Consumer>
        { (authUser) => (authUser ? <NavigationAuth {...props} uid={authUser.uid} /> : <NavigationNonAuth />)}
      </AuthUserContext.Consumer>
    </div>
  )
}

export default withFirebase(Navigation)
