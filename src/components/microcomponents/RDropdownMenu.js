import React from 'react';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

import '../../statics/css/custom-dropdown.css';

class RDropdownMenu extends React.Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      dropdownOpen: false,
	  items: this.props.items
    };
  }

  componentWillReceiveProps(nextProps) {
	this.setState({items: nextProps.items})
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
        <DropdownMenu className="custom-dropdown-menu">
			{this.state.items.map((item) => {
				return (<DropdownItem className="custom-dropdown-item" onClick={item.callback}>{item.text}</DropdownItem>)
			  })          
			}
        </DropdownMenu>
      </Dropdown>
    );
  }
}

export default RDropdownMenu;