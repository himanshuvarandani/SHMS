import React from 'react'
import { compose } from 'recompose'

import { withAuthorization } from '../Session'
import { withFirebase } from '../Firebase'

const PatientPageBase = (props) => {
  const [loading, setLoading] = React.useState(true)
  const [user, setUser] = React.useState({})

  React.useEffect(() => {
    props.firebase
      .user(props.match.params.uid)
      .once("value")
      .then((snapshot) => {
        setUser(snapshot.val())
        setLoading(false)
      })
  })

  return (
    <div>
      <h1>Patient: { !loading ? user.username : "Loading ..." }</h1>
    </div>
  )
}

const condition = (authUser) => !!authUser

const PatientPage = compose(
  withAuthorization(condition),
  withFirebase
)(PatientPageBase)

export default PatientPage