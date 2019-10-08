import React from 'react';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

import '../../statics/css/custom-select.css';
import arrow from '../../statics/images/inactive.svg';

class CustomSelect extends React.Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.state = {
      dropdownOpen: false,      
      items: this.props.items,
      selectedItem: this.props.items[0]?this.props.items[0]:''
    };
  }

  getSelectedItem() {
      return this.state.selectedItem;
  }
  toggle() {
    this.setState(prevState => ({
      dropdownOpen: !prevState.dropdownOpen
    }));
  }
  
  handleMenuClick(e,item) {    
    this.setState({selectedItem: item})
  }

  render() {
    return (
      <Dropdown className="swash-select" isOpen={this.state.dropdownOpen} toggle={this.toggle}>
        <DropdownToggle className='swash-select-container' tag='div'>
            <div className="swash-select-default">{this.state.selectedItem.description}</div>            
            <div className="swash-select-arrow">
                <img src={arrow}/>
            </div>
        </DropdownToggle>
        <DropdownMenu className="swash-select-menu">
          {this.state.items.map((item) => { return <DropdownItem onClick={(e) => this.handleMenuClick(e,item)} className="swash-select-item" tag='div'>{item.description}</DropdownItem>
          })}                     
        </DropdownMenu>
      </Dropdown>
    );
  }
}

export default CustomSelect;