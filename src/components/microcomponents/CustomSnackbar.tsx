// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import React from 'react';

import 'url:../../statics/css/custom-notifications.css';
import error from 'url:../../statics/images/error-icon.svg';
import success from 'url:../../statics/images/success-icon.svg';

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
    this.setState({
      notification: { status: true, message: message, type: type },
    });
  }

  handleNotificationByLink(message, type, link) {
    this.setState({
      notification: { status: true, message: message, type: type, link: link },
    });
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
          const notification = this.state.notification;
          notification.status = false;
          this.setState({ notification: notification });
        }}
      >
        <SnackbarContent
          classes={{ root: 'swash-notification' }}
          message={
            <div>
              <div className="swash-notification-icon">
                <img
                  alt={''}
                  src={
                    this.state.notification.type === 'success' ? success : error
                  }
                />
              </div>
              {this.state.notification.link ? (
                <span
                  className="swash-notification-message"
                  id="swash-message-id"
                >
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={this.state.notification.link}
                  >
                    {this.state.notification.message}
                  </a>
                </span>
              ) : (
                <span
                  className="swash-notification-message"
                  id="swash-message-id"
                >
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
