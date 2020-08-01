import React from 'react';

const Alerts = ({alerts}) => {
    return (
        <div>
        {
            alerts.map(alert => (
              <div key={alert.timestamp}>
                <div>{alert.type}</div>
                <div>{alert.timestamp}</div>
              </div>
            ))
          }
        </div>
    );
};

export default Alerts;