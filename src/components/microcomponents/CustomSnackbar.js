import React from 'react';
import '../../statics/css/custom-notifications.css';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import success from '../../statics/images/success-icon.svg';
import error from '../../statics/images/error-icon.svg';

class CustomSnackbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      notification: {
        status: false,
        type: '',
        message: '',
        link: '',
      },
    };
  }

  handleNotification(message, type) {
    this.setState({notification: {status: true, message: message, type: type}});
  }

  handleNotificationByLink(message, type, link) {
    this.setState({notification: {status: true, message: message, type: type, link: link}});
  }

  render() {
    return (
      <Snackbar
        autoHideDuration={3000}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={this.state.notification.status}
        onClose={() => {
          let notification = this.state.notification;
          notification.status = false;
          this.setState({notification: notification});
        }}>
        <SnackbarContent
          classes={{root: 'notification'}}
          message={
            <div>
              <div className="notification-icon">
                <img alt="" src={this.state.notification.type === 'success' ? success : error} />
              </div>
              {this.state.notification.link ? (
                <span className="notification-message" id="message-id">
                  <a target="_blank" rel="noreferrer" href={this.state.notification.link}>
                    {this.state.notification.message}
                  </a>
                </span>
              ) : (
                <span className="notification-message" id="message-id">
                  {this.state.notification.message}
                </span>
              )}
            </div>
          }
        />
      </Snackbar>
    );
  }
}

export default CustomSnackbar;
