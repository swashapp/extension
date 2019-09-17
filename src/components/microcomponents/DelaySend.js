import React from 'react';
import PropTypes from 'prop-types'
import {Collapse} from 'react-collapse';
import { MDBProgress } from 'mdbreact';

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
    const {isOpened, paragraphs} = this.state;

    return (
      <div>
        <div style={{ height: '120px', marginTop: '16px', backgroundColor: 'red'}}>
          <div>{this.props.domain}</div>
          <div>{this.props.module}</div>
          <div>{this.props.delay}</div>
          <label >Click<input
              type="checkbox"
              checked={isOpened}
              onChange={({target: {checked}}) => this.setState({isOpened: checked})} />
              </label>
      <MDBProgress className="my-2" material value={50} height="5px" color="info" />
        </div>

        <Collapse isOpened={isOpened}>
          <div className="text">
            {this.props.message.data}
          </div>
        </Collapse>
      </div>
    );
  }
}

export default DelaySend;