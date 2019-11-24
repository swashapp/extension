import React from 'react';
import PropTypes from 'prop-types';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';

function WalletDialog(props){

  const { onClose, open, items } = props;


  const handleListItemClick = value => {
    onClose(value);
  };


    return (
        <Dialog onClose={() => onClose('')} aria-labelledby="simple-dialog-title" open={open}>
        <DialogTitle id="simple-dialog-title">Saved wallet addresses</DialogTitle>
        <List>
            {items.map(item => (
            <ListItem button onClick={() => handleListItemClick(item)} key={item.wallet}>
                <ListItemText primary={item.name} secondary={item.wallet} />
            </ListItem>
            ))}
        </List>
        </Dialog>
    );
//    }
}

WalletDialog.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
  };

export default function WalletDialogButton(props){
    const [open, setOpen] = React.useState(false);
  
    const handleClickOpen = () => {
      setOpen(true);
    };
  
    const handleClose = value => {
      setOpen(false);
      props.onClose(value);
    };

    return (
            <div>
<button className="form-input-button" onClick={handleClickOpen}>Select</button>
        <WalletDialog open={open} onClose={handleClose} items={props.items}/>
        
            </div>
                            
    );
    
}