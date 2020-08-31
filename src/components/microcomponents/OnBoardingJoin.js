import React from 'react';

const SWASHDOMAIN = 'https://swashapp.io';
const SWASHJOINPAGE = '/join';
const MAXTOKENTRYCOUNT = 3;
const MAXGENERALTRYCOUNT = 3;

class OnBoardingJoin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {token: ''};
    this.tokenTryCount = 0;
    this.generalTryCount = 0;
    // This binding is necessary to make `this` work in the callback
    // this.XXX = this.XXX.bind(this);
    this.handleMessages = this.handleMessages.bind(this);
    this.LoadOnBoardingNew = this.LoadOnBoardingNew.bind(this);
    window.helper.generateJWT().then((token) => this.setState({token}));
    window.onmessage = this.handleMessages;
  }

  LoadOnBoardingNew() {
    this.props.ChangeOnBoardingPage(this.props.nextPage());
  }

  handleMessages(event) {
    if (event.origin !== SWASHDOMAIN || !event.data) return;

    let code = event.data.code;
    switch (code) {
      case 200:
        this.LoadOnBoardingNew();
        break;
      case 400:
        this.generalTryCount++;
        if (this.generalTryCount > MAXGENERALTRYCOUNT) this.reloadIFrame();
        break;
      case 401:
        this.tokenTryCount++;
        if (this.tokenTryCount > MAXTOKENTRYCOUNT) this.goToPreviousPage();
        break;
    }
    console.log(event);
  }

  goToNextPage() {
    this.props.ChangeOnBoardingPage(this.props.nextPage());
  }

  goToPreviousPage() {
    this.props.ChangeOnBoardingPage(this.props.previousPage());
  }

  reloadIFrame() {
    document.querySelector('.onboarding-iframe').currentTarget.style.visibility = 'hidden';
    document.querySelector('.onboarding-iframe-wrapper').style.visibility = 'visible';
    document.querySelector('.onboarding-iframe').src = document.querySelector('.onboarding-iframe').src;
  }

  render() {
    const makeVisible = (e) => {
      e.currentTarget.style.visibility = 'visible';
      document.querySelector('.onboarding-iframe-wrapper').style.visibility = 'hidden';
    };

    return (
      <div className="d-flex justify-content-center">
        <React.Fragment>
          <div className="onboarding-iframe-wrapper">
            {this.state.token ? (
              <iframe seamless className="onboarding-iframe" onLoad={makeVisible} src={`${SWASHDOMAIN}${SWASHJOINPAGE}?token=${this.state.token}`}>
                <p>Your browser does not support iframes.</p>
              </iframe>
            ) : (
              ''
            )}
          </div>
        </React.Fragment>
      </div>
    );
  }
}

export default OnBoardingJoin;
