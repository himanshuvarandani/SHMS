import React from 'react'
import { compose } from 'recompose'

import { withAuthorization } from '../Session'
import { withFirebase } from '../Firebase'

const DoctorPageBase = (props) => {
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
      <h1>Doctor: { !loading ? user.username : "Loading..." }</h1>
    </div>
  )
}

const condition = (authUser) => !!authUser

const DoctorPage = compose(
  withAuthorization(condition),
  withFirebase
)(DoctorPageBase)

export default DoctorPage