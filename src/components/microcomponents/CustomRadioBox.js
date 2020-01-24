import React from 'react';
import PropTypes from 'prop-types'


class CustomRadioBox extends React.Component {
  static propTypes = {
    isChecked: PropTypes.bool
  };


  static defaultProps = {
    isChecked: false
  };


  constructor(props) {
    super(props);
    this.state = {isChecked: this.props.checked};
  }

  componentDidMount(){     
    this.setState({isChecked: this.props.checked});
  }
  
  componentDidUpdate(prevProps){
      if (prevProps.checked !== this.props.checked) {
        this.setState({isChecked: this.props.checked});
      }
  }
  
  handleChange(e){
    this.setState({isChecked: e.target.checked});
    this.props.onChange(e);
  }

  render() {
    const {isChecked} = this.state;    
    return (
      <div className="swash-radiobox" onClick={()=>{this.setState({isChecked: !isChecked}); this.props.handleClick(this.state.isChecked)}}>
		  {isChecked?<div className="swash-radiobox-selected"></div>:''}
      </div>
    );
  }
}

export default CustomRadioBox;