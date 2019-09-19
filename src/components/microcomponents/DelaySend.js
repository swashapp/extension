import React from 'react';
import PropTypes from 'prop-types'
import {Collapse} from 'react-collapse';
import { MDBProgress } from 'mdbreact';
import CustomCheckBox from './CustomCheckBox'

import icon from '../../statics/images/network-navigation.svg'

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
    let progress_percentage = 55; //this.props.delay
    return (
      <div>
        <div className="accordion-head">
          <div className="accordion-domain">{this.props.domain}</div>
          <div className="accordion-module">{this.props.module}</div>
          <MDBProgress className="my-2" material value={progress_percentage} className="accordion-delay" color="info" />
          <CustomCheckBox
            className="accordion-checkbox"
            checked={isOpened}
              onChange={({target: {checked}}) => this.setState({isOpened: checked})} />
          <img src={icon} className="accordion-icon" />
          <a className="accordion-delete" />
        </div>

        <Collapse isOpened={isOpened}>
          <div className="accordion-text">
            <pre>
            {this.props.message.data}
            </pre>
          </div>
        </Collapse>
      </div>
    );
  }
}

export default DelaySend;