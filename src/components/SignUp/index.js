import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { compose } from 'recompose'

import './SignUp.css'

import { withAuthorization } from '../Session'
import { SignInLink } from '../SignIn'
import { withFirebase } from '../Firebase'

import * as Routes from '../../constants/routes'

const SignUpPage = () => {
  return (
    <div className="sign-up">
      <br />
      <h1 className="text-center">Sign Up</h1>
      <br />
      <SignUpForm />
      <SignInLink />
    </div>
  )
}

const initialState = {
  username: '',
  email: '',
  passwordOne: '',
  passwordTwo: '',
  type: 'Patient',
  error: null,
}

class SignUpFormBase extends Component {
  constructor(props) {
    super(props)

    this.state = {...initialState}
  }

  onSubmit = (event) => {
    const { username, email, passwordOne, type } = this.state

    this.props.firebase
      .doCreateUserWithEmailAndPassword(email, passwordOne)
      .then((authUser) => {
        this.props.firebase
          .user(authUser.user.uid)
          .set({
            "username": username,
            "email": email,
            "type": type,
          })
        
        this.setState({ ...initialState })
        
        if (type === "Doctor") {
          this.props.history.push(Routes.Doctor+"/"+authUser.user.uid)
        } else {
          this.props.history.push(Routes.Patient+"/"+authUser.user.uid)
        }
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
    const {
      username,
      email,
      passwordOne,
      passwordTwo,
      type,
      error,
    } = this.state

    const isInvalid = 
      passwordOne !== passwordTwo ||
      passwordOne === '' ||
      email === '' ||
      username === ''

    return (
      <form onSubmit={this.onSubmit}>
        <div className="form-group row justify-content-center">
          <label htmlFor="username" className="col-md-2 col-form-label">Username</label>
          <input
            id="username"
            name="username"
            className="col-md-4 ml-4 mr-4 form-control"
            value={username}
            onChange={this.onChange}
            type="text"
            placeholder="Full Name"
          />
        </div>
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
          <label htmlFor="passwordOne" className="col-md-2 col-form-label">Password</label>
          <input
            id="passwordOne"
            name="passwordOne"
            className="col-md-4 ml-4 mr-4 form-control"
            value={passwordOne}
            onChange={this.onChange}
            type="text"
            placeholder="Password"
          />
        </div>
        <div className="form-group row justify-content-center">
          <label htmlFor="passwordTwo" className="col-md-2 col-form-label">Confirm Password</label>
          <input
            id="passwordTwo"
            name="passwordTwo"
            className="col-md-4 ml-4 mr-4 form-control"
            value={passwordTwo}
            onChange={this.onChange}
            type="text"
            placeholder="Confirm Password"
          />
        </div>
        <div className="form-group row justify-content-center">
          <label htmlFor="type" className="col-md-2 col-form-label">Select Type</label>
          <select
            id="type"
            name="type"
            className="col-md-4 ml-4 mr-4 form-control"
            value={type}
            onChange={this.onChange}
          >
            <option value="Patient">Patient</option>
            <option value="Doctor">Doctor</option>
          </select>
        </div>
        <div className="d-flex flex-column align-items-center">
          <button disabled={isInvalid} type="submit" className="btn btn-primary">
            Sign Up
          </button>
          <br />
          {error && <p className="alert alert-danger">{error.message}</p>}
        </div>
      </form>
    )
  }
}

const SignUpLink = () => {
  return (
    <p className="sign-up-link">
      Don't have an account? <Link to={Routes.SignUp}>Sign Up</Link>
    </p>
  )
}

const condition = (authUser) => !authUser

const SignUpForm = compose(
  withAuthorization(condition),
  withRouter,
  withFirebase
)(SignUpFormBase)

export default SignUpPage

export { SignUpForm, SignUpLink }