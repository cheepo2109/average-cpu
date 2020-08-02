import React from 'react';
import { formatTooltip } from '../../utils';
import './alerts.css'
const Alerts = ({alerts}) => {
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
                  {`${messages[alert.type].time} ${formatTooltip(alert.timestamp)}`}
                </p>
              </div>
            ))
          }
        </div>
    );
};

export default Alerts;