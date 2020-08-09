import React from 'react';
import PropTypes from 'prop-types';

class CustomRadioBox extends React.Component {
  static propTypes = {
    isChecked: PropTypes.bool,
  };

  static defaultProps = {
    isChecked: false,
  };

  constructor(props) {
    super(props);
    this.state = {isChecked: this.props.isChecked};
  }

  componentDidMount() {
    this.setState({isChecked: this.props.isChecked});
  }

  componentDidUpdate(prevProps, prevStateS, snapshot) {
    if (prevProps.isChecked !== this.props.isChecked) {
      this.setState({isChecked: this.props.isChecked});
    }
  }

  handleChange(e) {
    this.setState({isChecked: e.target.isChecked});
    this.props.onChange(e);
  }

  render() {
    const {isChecked} = this.state;
    return (
      <div
        className="swash-radiobox"
        id={this.props.id}
        onClick={() => {
          if (this.props.handleClick) {
            this.setState({isChecked: true});
            this.props.handleClick(this.props.id);
          }
        }}>
        {isChecked ? <div className="swash-radiobox-selected" /> : ''}
      </div>
    );
  }
}

export default CustomRadioBox;
