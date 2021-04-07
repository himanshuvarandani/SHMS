import React from 'react'

import './landing.css'

const Landing = () => {
  return (
    <div className="container landing">
      <br />
      <h1 className="text-center"><b>WELCOME TO SHMS</b></h1>
      <br />
      <div className="container about">
        <h3 className="text-center">About Us</h3>
        <p className="text-center">
          A Smart Health Monitoring System, which consists of a device that monitors patient's 
          data in the form of pulse rate and body temperature along with room temperature and 
          humidity presenting the data here with details in pictorial view. SHMS also provides 
          system alerts in case the patients' health deteriorates exceeding beyond limit, 
          informing the Doctor and family.<br />
          SHMS commits a team of doctors who take care of patients along with a team of volunteers 
          who checks their data everyday until patient reaches a healthy and stable state.<br /><br />
          <b>Access Anytime Anywhere</b>
        </p>
        <br /><br />
        <h3 className="text-center">Contact Us</h3>
        <div className="d-flex flex-wrap justify-content-around align-items-around">
          <div className="card">
            <div className="container card-container">
              <h5><b>Misbah</b></h5>
              <p>Project Head<br />a@gmail.com<br />+91-5678956789</p>
            </div>
          </div>
          <div className="card">
            <div className="container card-container">
              <h5><b>Irfan</b></h5>
              <p>Hardware Designer<br />a@gmail.com<br />+91-5678956789</p>
            </div>
          </div>
          <div className="card">
            <div className="container card-container">
              <h5><b>Himanshu</b></h5>
              <p>Website Designer<br />a@gmail.com<br />+91-5678956789</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Landing