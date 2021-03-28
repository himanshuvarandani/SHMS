import React, { Component } from 'react'
import { compose } from 'recompose'
import { withRouter } from 'react-router'

import { PasswordForgetLink } from '../PasswordForget'
import { SignUpLink } from '../SignUp'
import { withAuthorization } from '../Session'
import { withFirebase } from '../Firebase'

import * as Routes from '../../constants/routes'

const SignInPage = () => {
  return (
    <div>
      <h1>SignIn</h1>
      <SignInForm />
      <PasswordForgetLink />
      <SignUpLink />
    </div>
  )
}

const initialState = {
  email: '',
  password: '',
  error: null,
}

class SignInFormBase extends Component {
  constructor(props) {
    super(props)

    this.state = { ...initialState }
  }

  onSubmit = (event) => {
    const { email, password } = this.state

    this.props.firebase
      .doSignInWithEmailAndPassword(email, password)
      .then((authUser) => {
        this.setState({ ...initialState })
        this.props.firebase
          .user(authUser.user.uid)
          .once('value')
          .then((snapshot) => {
            if (snapshot.val()) {
              if (snapshot.val().type === "Doctor") {
                this.props.history.push(Routes.Doctor+"/"+authUser.user.uid)
              } else {
                this.props.history.push(Routes.Patient+"/"+authUser.user.uid)
              }
            } else {
              this.setState({ error: "Some error occured, try Sign In again." })
            }
          })
          .catch((error) => {
            this.setState({ error })
          })
      })
      .catch((error) => {
        this.setState({ error })
      })
    
    event.preventDefault()
  }

  onChange = (event) => {
    this.setState({ [event.target.name]: event.target.value })
  }

  render() {
    const { email, password, error } = this.state

    const isInvalid = email === '' || password === ''

    return (
      <form onSubmit={this.onSubmit}>
        <input
          name="email"
          value={email}
          onChange={this.onChange}
          type="text"
          placeholder="Email Address"
        />
        <input
          name="password"
          value={password}
          onChange={this.onChange}
          type="text"
          placeholder="Password"
        />
        <button disabled={isInvalid} type="submit">
          Sign In
        </button>

        { error && <p>{ error.message }</p>}
      </form>
    )
  }
}

const condition = (authUser) => !authUser

const SignInForm = compose(
  withAuthorization(condition),
  withRouter,
  withFirebase,
)(SignInFormBase)

export default SignInPage

export { SignInForm }
