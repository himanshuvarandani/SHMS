import React from 'react'
import { Nav, Navbar } from 'react-bootstrap'

import { AuthUserContext } from '../Session'
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
    <Navbar bg="dark" variant="dark" expand="lg">
      <Navbar.Brand href={Routes.Landing}>SHMS</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          { type === "Doctor" ? (
            <Nav.Link href={Routes.Doctor+"/"+props.uid}>Home</Nav.Link>
          ) : (
            <Nav.Link href={Routes.Patient+"/"+props.uid}>Home</Nav.Link>
          )}
          <Nav.Link href={Routes.Account+"/"+props.uid}>Account</Nav.Link>
        </Nav>
        <Nav>
          <Nav.Link onClick={() => props.firebase.doSignOut()}>Sign Out</Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  )
}

const NavigationNonAuth = () => {
  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Navbar.Brand href={Routes.Landing}>SHMS</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="ml-auto">
          <Nav.Link href={Routes.SignIn}>Sign In</Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
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
