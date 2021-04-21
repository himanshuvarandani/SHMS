import React from 'react'
import { compose } from 'recompose'
import Calendar from 'react-calendar'
import Plot from 'react-plotly.js'

import 'react-calendar/dist/Calendar.css'
import './Patient.css'

import { withAuthorization } from '../Session'
import { withFirebase } from '../Firebase'

const formatDate = (date) => ((date.getMonth()+1).toString()+"-"+date.getDate().toString()+"-"+date.getFullYear().toString())

const PatientPageBase = (props) => {
  const [loading, setLoading] = React.useState(true)
  const [user, setUser] = React.useState({})
  const [date, setDate] = React.useState(formatDate(new Date()))
  const [today, setToday] = React.useState(formatDate(new Date()))
  const [BPM, setBPM] = React.useState("")
  const [RoomTemp, setRoomTemp] = React.useState("")
  const [Humidity, setHumidity] = React.useState("")
  const [BodyTemp, setBodyTemp] = React.useState("")
  const [width, setWidth] = React.useState()
  const [height, setHeight] = React.useState()
  const [colorsBPM, setColorsBPM] = React.useState("blue")
  const [colorsBodyTemp, setColorsBodyTemp] = React.useState("blue")
  const [alertMessage, setAlertMessage] = React.useState("")

  const setCurrentReadings = (user) => {
    if (today !== formatDate(new Date())) {
      setToday(formatDate(new Date()))
      setBPM("")
      setRoomTemp("")
      setHumidity("")
      setBodyTemp("")
    }

    if (user.readings) {
      if (user.readings.BPM) {
        if (user.readings.BPM[today]) {
          Object.keys(user.readings.BPM[today]).forEach((key) => {
            if (Number(key.replaceAll(':', '')) > Number(BPM.replaceAll(':', ''))) {
              setBPM(key)
            }
          })
        }
      }
    
      if ( user.readings["Room Temp"] && user.readings["Room Temp"][today]) {
        Object.keys(user.readings["Room Temp"][today]).forEach((key) => {
          if (Number(key.replaceAll(':', '')) > Number(RoomTemp.replaceAll(':', ''))) {
            setRoomTemp(key)
          }
        })
      }

      if ( user.readings.Humidity && user.readings.Humidity[today]) {
        Object.keys(user.readings.Humidity[today]).forEach((key) => {
          if (Number(key.replaceAll(':', '')) > Number(Humidity.replaceAll(':', ''))) {
            setHumidity(key)
          }
        })
      }

      if (user.readings["Body Temp"]) {
        if (user.readings["Body Temp"][today]) {
          Object.keys(user.readings["Body Temp"][today]).forEach((key) => {
            if (Number(key.replaceAll(':', '')) > Number(BodyTemp.replaceAll(':', ''))) {
              setBodyTemp(key)
            }
          })
        }
      }
    }
  }

  const setColors = (user) => {
    if (user.readings) {
      if (user.readings.BPM) {
        if (user.readings.BPM[date]) {
          setColorsBPM([])
          Object.keys(user.readings.BPM[date]).forEach((key) => {
            if (user.readings.BPM[date][key] > 180 || user.readings.BPM[date][key] < 30) {
              setColorsBPM(colorsBPM => [ ...colorsBPM, 'red' ])
            } else {
              setColorsBPM(colorsBPM => [ ...colorsBPM, 'blue' ])
            }
          })
        }
      }

      if (user.readings["Body Temp"]) {
        if (user.readings["Body Temp"][date]) {
          setColorsBodyTemp([])
          Object.keys(user.readings["Body Temp"][date]).forEach((key) => {
            if (user.readings["Body Temp"][date][key] > 40 || user.readings["Body Temp"][date][key] < 30) {
              setColorsBodyTemp(colorsBodyTemp => [ ...colorsBodyTemp, 'red' ])
            } else {
              setColorsBodyTemp(colorsBodyTemp => [ ...colorsBodyTemp, 'blue' ])
            }
          })
        }
      }
    }
  }

  const setAlerts = (user) => {
    if (user.readings) {
      if (user.readings.BPM) {
        if (user.readings.BPM.Alert === 2) {
          if (user.readings["Body Temp"]) {
            if (user.readings["Body Temp"].Alert === 2) {
              setAlertMessage("Your BPM and Body Temperature are high.")
            } else {
              if (user.readings["Body Temp"].Alert === 1) {
                setAlertMessage("Your BPM is high and Body Temperature is low.")
              } else {
                setAlertMessage("Your BPM is high.")
              }
            }
          }
        } else {
          if (user.readings.BPM.Alert === 1) {
            if (user.readings["Body Temp"]) {
              if (user.readings["Body Temp"].Alert === 2) {
                setAlertMessage("Your BPM is low and Body Temperature is high.")
              } else {
                if (user.readings["Body Temp"].Alert === 1) {
                  setAlertMessage("Your BPM and Body Temperature are low.")
                } else {
                  setAlertMessage("Your BPM is low.")
                }
              }
            }
          } else {
            if (user.readings["Body Temp"]) {
              if (user.readings["Body Temp"].Alert === 2) {
                setAlertMessage("Your Body Temperature is high.")
              } else {
                if (user.readings["Body Temp"].Alert === 1) {
                  setAlertMessage("Your Body Temperature is low.")
                } else {
                  setAlertMessage("")
                }
              }
            }
          }
        }
      } else {
        if (user.readings["Body Temp"]) {
          if (user.readings["Body Temp"].Alert === 2) {
            setAlertMessage("Your Body Temperature is high.")
          } else {
            if (user.readings["Body Temp"].Alert === 1) {
              setAlertMessage("Your Body Temperature is low.")
            } else {
              setAlertMessage("")
            }
          }
        }
      }
    }
  }

  React.useEffect(() => {
    if (window.innerWidth > 600) {
      setWidth(0.8*window.innerWidth)
      setHeight(0.4*window.innerWidth)
    } else {
      setWidth(0.9*window.innerWidth)
      setHeight(0.9*window.innerWidth)
    }
    
    props.firebase
      .user(props.match.params.uid)
      .on("value", (snapshot) => {
        setUser(snapshot.val())
        setCurrentReadings(snapshot.val())
        setColors(snapshot.val())
        setAlerts(snapshot.val())
        setLoading(false)
      })
  }, [date])

  const onChangeDate = (date) => {
    setDate(formatDate(date))
  }


  return (
    <div className="container patient">
      <br />
      <h1 className="text-center"><b>Patient: { !loading ? user.username : "Loading ..." }</b></h1>
      
      <br />
      { !loading ? (user.readings ? ( alertMessage ? (
        <p className="alert alert-danger text-center">{alertMessage}</p>
      ) : null) : null) : null }

      <br />
      { !loading ? (user.readings ? (
        <div className="readings">
          <div>
            <h3>Current Readings: </h3>
            
            <div className="text-center">
              <h5>BPM:</h5>
              <p>{ user.readings.BPM ? (user.readings.BPM[today] ? user.readings.BPM[today][BPM] : "No readings") : "No readings" }</p>
              
              <h5>Body Temperature:</h5>
              <p>{ user.readings["Body Temp"] ? (user.readings["Body Temp"][today] ? user.readings["Body Temp"][today][BodyTemp] : "No readings") : "No readings" }</p>
              
              <h5>Humidity:</h5>
              <p>{ user.readings.Humidity ? (user.readings.Humidity[today] ? user.readings.Humidity[today][Humidity] : "No readings") : "No readings" }</p>
              
              <h5>Room Temperature:</h5>
              <p>{ user.readings["Room Temp"] ? (user.readings["Room Temp"][today] ? user.readings["Room Temp"][today][RoomTemp] : "No readings") : "No readings" }</p>
            </div>
          </div>
        </div>
      ) : user.username+" has no readings.") : "Loading ..." }
      
      <br />
      { !loading ? (user.readings ? (
        <div className="d-flex flex-column align-items-center">
          <Calendar
            onChange={onChangeDate}
          />
          
          <br />
          { user.readings.BPM ? (user.readings.BPM[date] ? (
            <Plot
              data={[
                {
                  x: Object.keys(user.readings.BPM[date]),
                  y: Object.values(user.readings.BPM[date]),
                  type: 'scatter',
                  mode: 'lines+markers',
                  marker: {color: colorsBPM},
                  line: { color: 'rgb(92, 131, 150)' }
                },
              ]}
              layout={ {width: width, height: height, title: 'BPM Plot', margin: { l: 60, r: 30, pad: 4 }, yaxis: {rangemode: "tozero"}} }
            />
          ) : null) : null }
          
          <br />
          { user.readings["Body Temp"] ? (user.readings["Body Temp"][date] ? (
            <Plot
              data={[
                {
                  x: Object.keys(user.readings["Body Temp"][date]),
                  y: Object.values(user.readings["Body Temp"][date]),
                  type: 'scatter',
                  mode: 'lines+markers',
                  marker: {color: colorsBodyTemp},
                  line: { color: 'rgb(92, 131, 150)' }
                },
              ]}
              layout={ {width: width, height: height, title: 'Body Temperature Plot', margin: { l: 60, r: 30, pad: 4 }} }
            />
          ) : null) : null }
          
          <br />
          { user.readings.Humidity ? (user.readings.Humidity[date] ? (
            <Plot
              data={[
                {
                  x: Object.keys(user.readings.Humidity[date]),
                  y: Object.values(user.readings.Humidity[date]),
                  type: 'scatter',
                  mode: 'lines+markers',
                  marker: {color: 'blue'},
                  line: { color: 'rgb(92, 131, 150)' }
                },
              ]}
              layout={ {width: width, height: height, title: 'Humidity Plot', margin: { l: 60, r: 30, pad: 4 }} }
            />
          ) : null) : null }
          
          <br />
          { user.readings["Room Temp"] ? (user.readings["Room Temp"][date] ? (
            <Plot
              data={[
                {
                  x: Object.keys(user.readings["Room Temp"][date]),
                  y: Object.values(user.readings["Room Temp"][date]),
                  type: 'scatter',
                  mode: 'lines+markers',
                  marker: {color: 'blue'},
                  line: { color: 'rgb(92, 131, 150)' }
                },
              ]}
              layout={ {width: width, height: height, title: 'Room Temperature Plot', margin: { l: 60, r: 30, pad: 4 }} }
            />
          ) : null) : null }
          
          <br />
        </div>
      ) : null) : "Loading ..." }
    </div>
  )
}

const condition = (authUser) => !!authUser

const PatientPage = compose(
  withAuthorization(condition),
  withFirebase
)(PatientPageBase)

export default PatientPage