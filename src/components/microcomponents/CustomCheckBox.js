import React from 'react';
import PropTypes from 'prop-types'


class CustomCheckBox extends React.Component {
  static propTypes = {
    isChecked: PropTypes.bool
  };


  static defaultProps = {
    isChecked: false
  };


  constructor(props) {
    super(props);
    this.state = {isChecked: this.props.isChecked};
  }

  handleChange(e){
    this.setState({isChecked: e.target.checked});
    this.props.onChange(e);
  }

  render() {
    const {isChecked} = this.state;
    return (
      <div className={`custom-checkbox-container ${this.props.className}`} >
            <input
              type="checkbox"
              className="custom-checkbox"
              checked={isChecked}
              onChange={(e)=> this.handleChange(e)} />
            <div className="custom-checkbox-view"></div>
        </div>
    );
  }
}

export default CustomCheckBox;