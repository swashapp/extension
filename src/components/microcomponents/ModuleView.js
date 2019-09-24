import React from 'react';
import PropTypes from 'prop-types'
import {Collapse} from 'react-collapse';
import { MDBProgress } from 'mdbreact';
import CustomCheckBox from './CustomCheckBox'

import icon_default from '../../statics/images/network-navigation.svg'
import icon_open from '../../statics/images/Toggle_On.svg'
import icon_closed from '../../statics/images/Toggle_Off.svg'

class ModuleView extends React.Component {
  static propTypes = {
    isOpened: PropTypes.bool
  };


  static defaultProps = {
    isOpened: false
  };


  constructor(props) {
    super(props);
    this.state = {isOpened: this.props.isOpened};
  }


  render() {
    const {isOpened} = this.state;
    let progress_percentage = this.props.percentage;
    let iconArrow = isOpened? icon_open: icon_closed;
    let icon = (this.props.module.icon)? this.props.module.icon: icon_default;
    return (
      <div>
        <div className="accordion-head" >
          <div className="accordion-module-name">{this.props.module.title}</div>
          <img src={icon} className="accordion-module-icon" />
          <div className="accordion-switch" onClick={() => this.setState({isOpened: !isOpened})} ><img src={iconArrow}  /></div>
          
        </div>

        <Collapse isOpened={isOpened}>
          
        </Collapse>
      </div>
    );
  }
}

export default ModuleView;