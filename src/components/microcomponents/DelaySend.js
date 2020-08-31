import React from 'react';
import PropTypes from 'prop-types';
import {Collapse} from 'react-collapse';
import {MDBProgress} from 'mdbreact';
import RDropdownMenu from '../microcomponents/RDropdownMenu.js';

import icon_open from '../../statics/images/active.svg';
import icon_closed from '../../statics/images/inactive.svg';

class DelaySend extends React.Component {
  static propTypes = {
    isOpened: PropTypes.bool,
  };

  static defaultProps = {
    isOpened: false,
  };

  constructor(props) {
    super(props);
    this.state = {isOpened: this.props.isOpened};
  }

  render() {
    const {isOpened} = this.state;
    let progress_percentage = this.props.message.percentage;
    let iconArrow = isOpened ? icon_open : icon_closed;
    let classHeader = isOpened ? 'accordion-head accordion-head-open' : 'accordion-head';
    return (
      <div>
        <div className={classHeader}>
          <div className="accordion-domain">{this.props.message.link}</div>
          <div className="accordion-module">{this.props.message.title}</div>
          <MDBProgress material value={progress_percentage} className="accordion-delay" color="#ff5c00" />
          <img src={this.props.message.icon} alt="" className="accordion-icon" />
          {isOpened ? (
            <RDropdownMenu
              className="button form-input-button more-button"
              items={[{text: 'Delete', callback: () => this.props.onDelete(this.props.message)}]}
              ref="keyRevealMenu"
            />
          ) : (
            ''
          )}
          <div className="accordion-checkbox" onClick={() => this.setState({isOpened: !isOpened})}>
            <img alt={''} src={iconArrow} />
          </div>
          <button className="accordion-delete" onClick={() => this.props.onDelete(this.props.message)} />
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
