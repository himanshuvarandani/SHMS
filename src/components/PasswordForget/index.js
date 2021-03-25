import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import { withFirebase } from '../Firebase'
import * as Routes from '../../constants/routes'

const PasswordForgetPage = () => {
  return (
    <div>
      <h1>PasswordForget</h1>
      <PasswordForgetForm />
    </div>
  )
}

const initialState = {
  email: '',
  error: null,
}

class PasswordForgetFormBase extends Component {
  constructor(props) {
    super(props)

    this.state = { ...initialState }
  }

  onSubmit = (event) => {
    const { email } = this.state

    this.props.firebase
      .doSendPasswordResetEmail(email)
      .then(() => {
        this.setState({ ...initialState })
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
    const { email, error } = this.state

    const isInvalid = email === ''

    return (
      <form onSubmit={this.onSubmit}>
        <input
          name="email"
          value={email}
          onChange={this.onChange}
          type="text"
          placeholder="Email"
        />
        <button disabled={isInvalid} type="submit">
          Reset Password
        </button>

        { error && <p>{error.message}</p>}
      </form>
    )
  }
}

const PasswordForgetLink = () => {
  return (
    <p>
      <Link to={Routes.PasswordForget}>Forget Password</Link>
    </p>
  )
}

const PasswordForgetForm = withFirebase(PasswordForgetFormBase)

export default PasswordForgetPage

export { PasswordForgetForm, PasswordForgetLink }