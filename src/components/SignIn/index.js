import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { compose } from 'recompose'

import './SignIn.css'

import { PasswordForgetLink } from '../PasswordForget'
import { SignUpLink } from '../SignUp'
import { withAuthorization } from '../Session'
import { withFirebase } from '../Firebase'

import * as Routes from '../../constants/routes'

const SignInPage = () => {
  return (
    <div className="container sign-in">
      <br />
      <h1 className="text-center">SignIn</h1>
      <br />
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
        <div className="form-group row justify-content-center">
          <label htmlFor="email" className="col-md-2 col-form-label">Email</label>
          <input
            id="email"
            name="email"
            className="col-md-4 ml-4 mr-4 form-control"
            value={email}
            onChange={this.onChange}
            type="text"
            placeholder="Email Address"
          />
        </div>
        <div className="form-group row justify-content-center">
          <label htmlFor="password" className="col-md-2 col-form-label">Password</label>
          <input
            id="password"
            name="password"
            className="col-md-4 ml-4 mr-4 form-control"
            value={password}
            onChange={this.onChange}
            type="text"
            placeholder="Password"
          />
        </div>
        <div className="d-flex flex-column align-items-center">
          <button disabled={isInvalid} type="submit" className="btn btn-primary">
            Sign In
          </button>
          <br />
          { error && <p className="alert alert-danger">{ error.message }</p>}
        </div>
      </form>
    )
  }
}

const SignInLink = () => {
  return (
    <p className="sign-in-link">
      Already have an account? <Link to={Routes.SignIn}>Sign In</Link>
    </p>
  )
}

const condition = (authUser) => !authUser

const SignInForm = compose(
  withAuthorization(condition),
  withRouter,
  withFirebase,
)(SignInFormBase)

export default SignInPage

export { SignInLink, SignInForm }
