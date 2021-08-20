import React from 'react';

class WarningOnPages extends React.Component {
  constructor(props) {
    super(props);
    this.state = {showJoinWarning: false};
    this.removeWarning = this.removeWarning.bind(this);
  }

  componentDidMount() {
    window.helper.isNeededJoin().then((status) => {
      this.setState({showJoinWarning: status});
    });
  }

  removeWarning() {
    this.setState({showJoinWarning: false});
  }

  openJoin() {
    window.helper.repeatOnboarding(['Join', 'Completed'], true).then();
  }

  render() {
    if (this.state.showJoinWarning === true) {
      return (
        <div className="swash-notification-bar">
          <div className="alert alert-warning alert-dismissible fade show">
            <strong>Warning!</strong> Your status is not valid any more, please
            <span className={'notification-span'} onClick={this.openJoin}>
              CLICK HERE
            </span>
            .
            <button type="button" className="close" data-dismiss="alert" onClick={this.removeWarning}>
              &times;
            </button>
          </div>
        </div>
      );
    } else return <></>;
  }
}

export default WarningOnPages;
