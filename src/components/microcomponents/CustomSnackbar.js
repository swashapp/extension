import React from 'react'
import '../../statics/css/custom-notifications.css';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import success from '../../statics/images/success-icon.svg'
import error from '../../statics/images/error-icon.svg'


class CustomSnackbar extends React.Component {
    constructor(props) {
        super(props);
		this.state = {
			notification: {
                status: false,
                type:'',
                message: ""
            }
		}
    }


    handleNotification(message,type) {
        this.setState({notification: {status:true, message: message, type:type}});
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
                    this.setState({notification: notification})}
            }
            >
                <SnackbarContent                    
                    classes= {{root: 'notification'}}
                        message={<div>                            
                                <div className="notification-icon">
                                    <img alt="" src={this.state.notification.type === 'success'?success:error}/>
                                </div>
                                <span className="notification-message" id="message-id" dangerouslySetInnerHTML={{__html: this.state.notification.message}}></span>
                            </div>}  
                />
            </Snackbar>
        );
    }
}

export default CustomSnackbar;