import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import './PasswordForget.css'

import { withFirebase } from '../Firebase'
import * as Routes from '../../constants/routes'

const PasswordForgetPage = () => {
  return (
    <div className="container pw-forget">
      <br />
      <h1 className="text-center">Forget Password</h1>
      <br />
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
      <div className="d-flex flex-column align-items-center">
        <form onSubmit={this.onSubmit}>
          <div className="d-flex flex-column flex-sm-row align-items-center">
            <div className="m-2">
              <input
                className="form-control"
                name="email"
                value={email}
                onChange={this.onChange}
                type="text"
                placeholder="Email"
              />
            </div>
            <div className="m-2">
              <button disabled={isInvalid} type="submit" className="btn btn-primary">
                Reset Password
              </button>
            </div>
          </div>
        </form>

        <br />
        { error && <p className="alert alert-danger">{error.message}</p>}
      </div>
    )
  }
}

const PasswordForgetLink = () => {
  return (
    <p className="pw-forget-link">
      <Link to={Routes.PasswordForget}>Forget Password</Link>
    </p>
  )
}

const PasswordForgetForm = withFirebase(PasswordForgetFormBase)

export default PasswordForgetPage

export { PasswordForgetForm, PasswordForgetLink }