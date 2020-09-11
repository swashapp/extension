import React from 'react';
import {Dropdown, DropdownItem, DropdownMenu, DropdownToggle} from 'reactstrap';

import '../../statics/css/custom-dropdown.css';
import PropTypes from 'prop-types';

class RDropdownMenu extends React.Component {
  static get propTypes() {
    return {
      items: PropTypes.array,
      className: PropTypes.string,
    };
  }

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
        <DropdownToggle className={this.state.dropdownOpen ? this.props.className + ' swash-more-button-active' : this.props.className} tag="div" />
        <DropdownMenu className="swash-custom-dropdown-menu">
          {this.state.items.map((item) => {
            return (
              <DropdownItem className="swash-custom-dropdown-item" onClick={item.callback} key={item.text}>
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
