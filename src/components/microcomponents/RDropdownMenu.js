import React from 'react';
import {Dropdown, DropdownItem, DropdownMenu, DropdownToggle} from 'reactstrap';

import '../../statics/css/custom-dropdown.css';

class RDropdownMenu extends React.Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      dropdownOpen: false,
      items: this.props.items,
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.setState({items: nextProps.items});
  }

  toggle() {
    this.setState((prevState) => ({
      dropdownOpen: !prevState.dropdownOpen,
    }));
  }

  render() {
    return (
      <Dropdown className="swash-custom-dropdown" isOpen={this.state.dropdownOpen} toggle={this.toggle}>
        <DropdownToggle
          className={this.state.dropdownOpen ? this.props.className + ' swash-more-button-active' : this.props.className}
          tag="div"></DropdownToggle>
        <DropdownMenu className="swash-custom-dropdown-menu">
          {this.state.items.map((item) => {
            return (
              <DropdownItem className="swash-custom-dropdown-item" onClick={item.callback}>
                {item.text}
              </DropdownItem>
            );
          })}
        </DropdownMenu>
      </Dropdown>
    );
  }
}

export default RDropdownMenu;
