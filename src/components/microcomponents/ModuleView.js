import React from 'react';
import PropTypes from 'prop-types'
import {Collapse} from 'react-collapse';
import { MDBProgress } from 'mdbreact';
import CustomCheckBox from './CustomCheckBox'
import ModuleDetailView from './ModuleDetailView';
import icon_default from '../../statics/images/network-navigation.svg'
import icon_open from '../../statics/images/Toggle_On.svg'
import icon_closed from '../../statics/images/Toggle_Off.svg'

class ModuleView extends React.Component {
  static propTypes = {
    isOpened: PropTypes.bool
  };


  static defaultProps = {
    isOpened: false,
    isActive: false
  };


  constructor(props) {
    super(props);
    this.state = {isOpened: this.props.isOpened};
  }


  render() {
    const {isOpened, isActive} = this.state;
    let progress_percentage = this.props.percentage;
    let iconArrow = isActive? icon_open: icon_closed;
    let icon = (this.props.module.icons)? this.props.module.icons[0]: icon_default;
    let classBody = "accordion-body";
    let classHeader = (isOpened)?"accordion-head accordion-head-open":"accordion-head";
    return (
      <div>
        <div className={classHeader} onClick={() => this.setState({isOpened: !isOpened})}>
          <div className="accordion-module-name">{this.props.module.name}</div>
          <img src={icon} className="accordion-module-icon" />
          <div className="accordion-switch" onClick={(e) => {e.stopPropagation(); this.setState({isActive: !isActive})}} ><img src={iconArrow}  /></div>
          
        </div>

        <Collapse isOpened={isOpened}>
          <div className={classBody}>
            <ModuleDetailView module={this.props.module} />
          </div>
        </Collapse>
      </div>
    );
  }
}

export default ModuleView;