import React from 'react';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

import '../../statics/css/custom-dropdown.css';

class RDropdownMenu extends React.Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      dropdownOpen: false,
      revealText: "Reveal"
    };
  }

  toggle() {
    this.setState(prevState => ({
      dropdownOpen: !prevState.dropdownOpen
    }));
  }
  
  toggleText(e) {
    if(e.target.innerText === 'Reveal')
      this.setState({revealText: "Hide"})
    else
    this.setState({revealText: "Reveal"})
  }

  render() {
    return (
      <Dropdown className="custom-dropdown" isOpen={this.state.dropdownOpen} toggle={this.toggle}>
        <DropdownToggle className={this.state.dropdownOpen?this.props.className + " more-button-active":this.props.className} tag='div'>          
        </DropdownToggle>
        <DropdownMenu className="custom-dropdown-menu">          
          <DropdownItem className="custom-dropdown-item" onClick={(e) => {this.props.callbacks[0](e); this.toggleText(e)}}>{this.state.revealText}</DropdownItem>
          <DropdownItem className="custom-dropdown-item" onClick={this.props.callbacks[1]}>Copy</DropdownItem>       
        </DropdownMenu>
      </Dropdown>
    );
  }
}

export default RDropdownMenu;