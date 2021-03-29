import React from 'react'
import { compose } from 'recompose'
import { Link } from 'react-router-dom'

import { withAuthorization } from '../Session'
import { withFirebase } from '../Firebase'

import * as Routes from '../../constants/routes'

const DoctorPageBase = (props) => {
  const [error, setError] = React.useState(null)
  const [loading, setLoading] = React.useState(true)
  const [user, setUser] = React.useState({})
  const [username, setUsername] = React.useState("")

  React.useEffect(() => {
    props.firebase
      .user(props.match.params.uid)
      .once("value")
      .then((snapshot) => {
        setUser(snapshot.val())
        setLoading(false)
      })
  })

  const onSubmit = (event) => {
    props.firebase
      .users()
      .orderByChild("username")
      .equalTo(username)
      .once("value")
      .then((snapshot) => {
        if (snapshot.val()) {
          let patientUid = Object.keys(snapshot.val())[0]
          if (snapshot.val()[patientUid].type === "Patient") {
            let object = {}
            object[patientUid] = true
            props.firebase
              .user(props.match.params.uid)
              .child("/patients")
              .update(object)
            
            setUsername("")
            setLoading("true")
            setError(null)
          } else {
            setError(username + " is not a patient.")
          }
        } else {
          setError(username + " is not a patient.")
        }
      })
    
    event.preventDefault()
  }

  const onChangeUsername = (event) => setUsername(event.target.value)

  const isInvalid = username === ""

  return (
    <div>
      <h1>Doctor: { !loading ? user.username : "Loading..." }</h1>
      <p>
        { !loading ? (!!user.patients ? (Object.keys(user.patients).map((key) => {
          return (
            <div>
              <Link to={Routes.Patient+"/"+key}>Patient {key}</Link>
              <br />
            </div>
          )
        })) : null) : "Loading..." }
      </p>
      <form onSubmit={onSubmit}>
        <input
          name="username"
          value={username}
          onChange={onChangeUsername}
          type="text"
          placeholder="Patient Username"
        />
        <button disabled={isInvalid} type="submit">Add Patient</button>

        { error && <p>{ error }</p>}
      </form>
    </div>
  )
}

const condition = (authUser) => !!authUser

const DoctorPage = compose(
  withAuthorization(condition),
  withFirebase
)(DoctorPageBase)

export default DoctorPage