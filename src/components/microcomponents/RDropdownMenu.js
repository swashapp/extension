import React from 'react';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

import checked from '../../statics/images/checked.svg';
import unchecked from '../../statics/images/Unchecked.svg';

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
      <Dropdown size="sm" isOpen={this.state.dropdownOpen} toggle={this.toggle}>
        <DropdownToggle className={this.props.className}>
          ...
        </DropdownToggle>
        <DropdownMenu>          
          <DropdownItem>Reveal</DropdownItem>
          <DropdownItem>Copy</DropdownItem>       
        </DropdownMenu>
      </Dropdown>
    );
  }
}

export default RDropdownMenu;