import React from 'react';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import Avatar from '@material-ui/core/Avatar';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';


import '../../statics/css/custom-dropdown.css';


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

function DonateDialog(props){

  const { onClose, open, items } = props;


  const handleListItemClick = value => {
    onClose(value);
  };


    return (
        <Dialog onClose={() => onClose('')} aria-labelledby="simple-dialog-title" open={open}>
        <DialogTitle id="simple-dialog-title">Donate list</DialogTitle>
        <List>
            {items.map(item => (
            <ListItem button onClick={() => handleListItemClick(item)} key={item.wallet}>
                <ListItemAvatar>
                  <Avatar >
                    <img width='40' height='40'  src={item.icon}/>
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={item.name} secondary={item.wallet} />
            </ListItem>
            ))}
        </List>
        </Dialog>
    );
//    }
}

class TransferDropdownMenu extends React.Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      dropdownOpen: false,
      walletDialogOpen: false,
      donateDialogOpen: false
    };
  }

  toggle() {
    this.setState(prevState => ({
      dropdownOpen: !prevState.dropdownOpen
    }));
  }

  render() {
    return (
      <Dropdown className="custom-dropdown" isOpen={this.state.dropdownOpen} toggle={this.toggle}>
        <DropdownToggle className={this.state.dropdownOpen?this.props.className + " more-button-active":this.props.className} tag='div'>          
        </DropdownToggle>
        <DropdownMenu className="custom-dropdown-menu-transfer">          
          <DropdownItem className="custom-dropdown-item" onClick={() => {this.setState({walletDialogOpen: true})}}>Saved wallets</DropdownItem>
          <DropdownItem className="custom-dropdown-item" onClick={() => {this.setState({donateDialogOpen: true})}}>Donate list</DropdownItem>
              
        </DropdownMenu>
        <WalletDialog open={this.state.walletDialogOpen} onClose={(value)=> {this.setState({walletDialogOpen: false}); this.props.handleSavedWalletDialogClose(value)}} items={this.props.profileWallets}/>
        <DonateDialog open={this.state.donateDialogOpen} onClose={(value)=> {this.setState({donateDialogOpen: false}); this.props.handleDonateDialogClose(value)}} items={this.props.donateList}/>
      </Dropdown>
    );
  }
}

export default TransferDropdownMenu;