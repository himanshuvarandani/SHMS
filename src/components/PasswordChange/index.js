import React, { Component } from 'react'

import { withFirebase } from '../Firebase'

const initialState = {
  passwordOne: '',
  passwordTwo: '',
  error: null,
}

class PasswordChangeForm extends Component {
  constructor(props) {
    super(props)

    this.state = { ...initialState }
  }

  onSubmit = (event) => {
    const { passwordOne } = this.state

    this.props.firebase
      .doUpdatePassword(passwordOne)
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
    const { passwordOne, passwordTwo, error } = this.state

    const isInvalid = passwordOne === '' || passwordTwo !== passwordOne

    return(
      <div className="d-flex flex-column align-items-center">
        <form onSubmit={this.onSubmit}>
          <div className="d-flex flex-column flex-sm-row align-items-center">
            <div className="m-2">
              <input
                className="form-control"
                name="passwordOne"
                value={passwordOne}
                onChange={this.onChange}
                type="text"
                placeholder="New Password"
              />
            </div>
            <div className="m-2">
              <input
                className="form-control"
                name="passwordTwo"
                value={passwordTwo}
                onChange={this.onChange}
                type="text"
                placeholder="Confirm New Password"
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
        { error && <p>{ error.message }</p>}
      </div>
    )
  }
}

export default withFirebase(PasswordChangeForm)