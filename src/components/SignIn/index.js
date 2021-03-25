import React, { Component } from 'react'
import { compose } from 'recompose'
import { withRouter } from 'react-router'

import { PasswordForgetLink } from '../PasswordForget'
import { SignUpLink } from '../SignUp'
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
      .then(() => {
        this.setState({ ...initialState })
        this.props.history.push(Routes.Home)
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

const SignInForm = compose(
  withRouter,
  withFirebase,
)(SignInFormBase)

export default SignInPage

export { SignInForm }
