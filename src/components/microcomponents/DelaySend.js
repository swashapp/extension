import React from 'react';
import PropTypes from 'prop-types'
import {Collapse} from 'react-collapse';
import { MDBProgress } from 'mdbreact';
import CustomCheckBox from './CustomCheckBox'

import icon from '../../statics/images/network-navigation.svg'
import icon_open from '../../statics/images/active.svg'
import icon_closed from '../../statics/images/inactive.svg'

class DelaySend extends React.Component {
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
    let classHeader = (isOpened)?"accordion-head accordion-head-open":"accordion-head";
    return (
      <div>
        <div className={classHeader} >
          <div className="accordion-domain">{this.props.message.link}</div>
          <div className="accordion-module">{this.props.message.title}</div>
          <MDBProgress className="my-2" material value={progress_percentage} className="accordion-delay" color="info" />
          <img src={this.props.message.icon} className="accordion-icon" />
          <div className="accordion-checkbox" onClick={() => this.setState({isOpened: !isOpened})} ><img src={iconArrow}  /></div>
          <a className="accordion-delete" onClick={() => this.props.onDelete(this.props.message)} />
        </div>

        <Collapse isOpened={isOpened}>
          <div className="accordion-text">
            
            <pre>{JSON.stringify(this.props.message.msg, null, 4)}</pre>
            
          </div>
        </Collapse>
      </div>
    );
  }
}

export default DelaySend;