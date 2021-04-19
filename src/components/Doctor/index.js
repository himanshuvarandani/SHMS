import React from 'react'
import { compose } from 'recompose'
import { Link } from 'react-router-dom'

import './Doctor.css'

import { withAuthorization } from '../Session'
import { withFirebase } from '../Firebase'

import * as Routes from '../../constants/routes'

const DoctorPageBase = (props) => {
  const [error, setError] = React.useState(null)
  const [loading, setLoading] = React.useState(true)
  const [patients, setPatients] = React.useState({})
  const [user, setUser] = React.useState({})
  const [username, setUsername] = React.useState("")

  React.useEffect(() => {
    props.firebase
      .user(props.match.params.uid)
      .on("value", (snapshot) => {
        setUser(snapshot.val())

        if (snapshot.val().patients) {
          let length = Object.keys(snapshot.val().patients).length
          Object.keys(snapshot.val().patients).map((key, idx) =>{
            props.firebase
              .user(key)
              .on("value", (patient) => {
                setPatients((prevPatients) => ({ ...prevPatients, [key]: patient.val()}))
                if(idx === length-1) {
                  setLoading(false)
                }
              })
          })
        } else {
          setLoading(false)
        }
      })
  }, [loading])

  const onSubmit = (event) => {
    setLoading(true)
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
    <div className="container doctor">
      <br />
      <h1 className="text-center">Doctor: { !loading ? user.username : "Loading..." }</h1>
      <br />
      <div className="d-flex flex-wrap justify-content-center align-items-center">
        { !loading ? (!!user.patients ? (Object.keys(user.patients).map((key) => {
          return (
            <Link to={Routes.Patient+"/"+key}>
              <div className="card m-2 pt-2">
                <div className="container card-container">
                  <h5>Patient {patients[key].username}</h5>
                  <p>{patients[key].email}</p>
                </div>
              </div>
            </Link>
          )
        })) : <p className="alert alert-secondary">No Patients</p>) : "Loading..." }
      </div>

      <br />
      <div className="d-flex flex-column align-items-center">
        <form onSubmit={onSubmit}>
          <div className="d-flex flex-column flex-sm-row align-items-center">
            <div className="m-2">
              <input
                className="form-control"
                name="username"
                value={username}
                onChange={onChangeUsername}
                type="text"
                placeholder="Patient Username"
              />
            </div>
            <div className="m-2">
              <button disabled={isInvalid} type="submit" className="btn btn-primary">
                Add Patient
              </button>
            </div>
          </div>
        </form>
        
        <br />
        { error && <p className="alert alert-danger">{ error }</p>}
      </div>
    </div>
  )
}

const condition = (authUser) => !!authUser

const DoctorPage = compose(
  withAuthorization(condition),
  withFirebase
)(DoctorPageBase)

export default DoctorPage