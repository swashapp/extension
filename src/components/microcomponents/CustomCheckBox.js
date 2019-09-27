import React from 'react';
import PropTypes from 'prop-types'

import checked from '../../statics/images/checked.svg';
import unchecked from '../../statics/images/Unchecked.svg';

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
    const icon = isChecked? checked: unchecked;
    return (
      <div className="checkbox" onClick={()=>{this.setState({isChecked: !isChecked}); this.props.handleClick()}}>
        <img src={icon} style={{width: 16, height:16}} />
      </div>
    );
  }
}

export default CustomCheckBox;