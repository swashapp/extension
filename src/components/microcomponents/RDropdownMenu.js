import React from 'react';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

import '../../statics/css/custom-dropdown.css';

class RDropdownMenu extends React.Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      dropdownOpen: false
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
        <DropdownToggle className={this.props.className} tag='div'>          
        </DropdownToggle>
        <DropdownMenu className="custom-dropdown-menu">          
          <DropdownItem className="custom-dropdown-item" onClick={this.props.callbacks[0]}>Reveal</DropdownItem>
          <DropdownItem className="custom-dropdown-item" onClick={this.props.callbacks[1]}>Copy</DropdownItem>       
        </DropdownMenu>
      </Dropdown>
    );
  }
}

export default RDropdownMenu;