import React from 'react';

const Alerts = ({alerts}) => {
    return (
        <div>
        {
            alerts.map(alert => (
              <div>
                <div>{alert.message}</div>
                <div>{alert.timestamp}</div>
              </div>
            ))
          }
        </div>
    );
};

export default Alerts;