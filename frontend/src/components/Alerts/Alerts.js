import React from 'react';
import './alerts.css'
const Alerts = () => {
    const alerts = [
      {
        type: "warning",
        timestamp:"2141"
      },
      {
        type: "recovery",
        timestamp:"123456"
      },
      {
        type: "warning",
        timestamp:"21985"
      },
      {
        type: "recovery",
        timestamp:"21521"
      },
      {
        type: "warning",
        timestamp:"14214"
      },
      {
        type: "recovery",
        timestamp:"124421"
      },
      {
        type: "warning",
        timestamp:"142214"
      },
    ]
    const messages = {
      warning: {
        message: "High CPU usage",
        time: "Started at"
      },
      recovery: {
        message: "CPU recovered",
        time: "High load finished at"
      }
    }
    return (
        <div className="alerts">
        {
            alerts.map((alert, index) => (
              <div className={`alert alert--${alert.type}`} key={alert.timestamp}>
                <p className="alert__message">
                  {`[${index+1}] ${messages[alert.type].message}`}
                </p>
                <p className="alert__time">
                  {`${messages[alert.type].time} ${alert.timestamp}`}
                </p>
              </div>
            ))
          }
        </div>
    );
};

export default Alerts;