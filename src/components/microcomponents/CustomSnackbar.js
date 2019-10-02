import React from 'react'
import '../../statics/css/custom-notifications.css';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import success from '../../statics/images/success-icon.svg'
import error from '../../statics/images/error-icon.svg'


class CustomSnackbar extends React.Component {
    constructor(props) {
        super(props);        
    }


    
    
    render() {   
        const {notification, onClose} = this.props; 
        return (
            <Snackbar
                autoHideDuration={4000}                
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}                    
                open={notification.status}
                onClose={onClose}
            >
                <SnackbarContent                    
                    classes= {{root: 'notification'}}
                        message={<div>                            
                                <div className="notification-icon">
                                    <img src={notification.type?'success':success,error}/>
                                </div>
                                <span id="message-id">{notification.message}</span>
                            </div>}  
                />
            </Snackbar>
        );
    }
}

export default CustomSnackbar;