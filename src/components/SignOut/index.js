import React, { Component } from 'react'

import { withFirebase } from '../Firebase'

class SignOutButton extends Component {
  constructor(props) {
    super(props)
  }
  
  onClick = () => {
    this.props.firebase.auth.signOut()
  }

  render() {
    return (
      <button type="button" onClick={this.onClick}>
        Sign Out
      </button>
    )
  }
}

export default withFirebase(SignOutButton)