import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { compose } from 'recompose'

import { withFirebase } from '../Firebase'
import * as Routes from '../../constants/routes'

const SignUpPage = () => {
  return (
    <div>
      <h1>Sign Up</h1>
      <SignUpForm />
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
        return this.props.firebase
          .user(authUser.user.uid)
          .set({
            username,
            email,
            type,
          })
      })
      .then((authUser) => {
        this.setState({ ...initialState })
        this.props.history.push(Routes.Home)
      })
      .catch((error) => {
        console.log(error)
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
        <input
          name="username"
          value={username}
          onChange={this.onChange}
          type="text"
          placeholder="Full Name"
        />
        <input
          name="email"
          value={email}
          onChange={this.onChange}
          type="text"
          placeholder="Email Address"
        />
        <input
          name="passwordOne"
          value={passwordOne}
          onChange={this.onChange}
          type="text"
          placeholder="Password"
        />
        <input
          name="passwordTwo"
          value={passwordTwo}
          onChange={this.onChange}
          type="text"
          placeholder="Confirm Password"
        />
        <select
          name="type"
          value={type}
          onChange={this.onChange}
        >
          <option value="Patient">Patient</option>
          <option value="Doctor">Doctor</option>
        </select>
        <button disabled={isInvalid} type="submit">
          Sign Up
        </button>

        {error && <p>{error.message}</p>}
      </form>
    )
  }
}

const SignUpLink = () => {
  return (<p>Don't have an account? <Link to={Routes.SignUp}>Sign Up</Link></p>)
}

const SignUpForm = compose(
    withRouter,
    withFirebase
  )(SignUpFormBase)

export default SignUpPage

export { SignUpForm, SignUpLink }