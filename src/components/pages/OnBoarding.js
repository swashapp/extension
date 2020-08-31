import React from 'react';
import {Redirect} from 'react-router-dom';
import OnBoardingWelcomePage from '../microcomponents/OnBoardingWelcome';
import OnBoardingYourProfileWarning from '../microcomponents/OnBoardingYourProfileWarning';
import OnBoardingPrivacyPolicy from '../microcomponents/OnBoardingPrivacyPolicy';
import OnBoardingResponsibility from '../microcomponents/OnBoardingResponsibility';
import OnBoardingNewPage from '../microcomponents/OnBoardingNew';
import OnBoardingImportPage from '../microcomponents/OnBoardingImport';
import OnBoardingCreatePage from '../microcomponents/OnBoardingCreate';
import OnBoardingYourProfile from '../microcomponents/OnBoardingYourProfile';
import OnBoardingJoin from '../microcomponents/OnBoardingJoin';

class OnBoardingPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      Flow: [],
      currentPage: '',
      onSelectedPage: {},
      shouldRedirect: false,
    };

    // This binding is necessary to make `this` work in the callback
    // this.XXX = this.XXX.bind(this);
    this.getNextPage = this.getNextPage.bind(this);
    this.getPreviousPage = this.getPreviousPage.bind(this);
    this.loadOnboarding = this.loadOnboarding.bind(this);
    this.changeOnboardingPage = this.changeOnboardingPage.bind(this);
    this.changeSelectedPage = this.changeSelectedPage.bind(this);
  }

  componentDidMount() {
    window.helper.getOnboardingFlow().then((flow) => {
      let newFlow = JSON.parse(flow);
      this.setState({Flow: newFlow, CurrentPage: newFlow.start});
    });
  }

  getPageAfter(page) {
    let nextPage = this.state.Flow.pages[page].next;
    if (typeof nextPage === 'object' && nextPage['basedOnPage']) {
      this.state.onSelectedPage[nextPage['basedOnPage']]
        ? (nextPage = this.state.onSelectedPage[nextPage['basedOnPage']])
        : (nextPage = nextPage['default']);
    }
    return nextPage;
  }

  getNextPage() {
    let flow = this.state.Flow;
    let nextPage = this.getPageAfter(this.state.CurrentPage);
    while (flow.pages[nextPage].visible === 'none') nextPage = this.getPageAfter(nextPage);
    flow.pages[nextPage]['back'] = this.state.CurrentPage;
    this.setState({Flow: flow});
    return nextPage;
  }

  getPreviousPage() {
    return this.state.Flow.pages[this.state.CurrentPage].back;
  }

  loadOnboarding() {
    let page = this.state.CurrentPage;
    switch (page) {
      case 'Welcome':
        return (
          <OnBoardingWelcomePage ChangeOnBoardingPage={this.changeOnboardingPage} nextPage={this.getNextPage} previousPage={this.getPreviousPage} />
        );
      case 'YourProfileWarning':
        return (
          <OnBoardingYourProfileWarning
            ChangeOnBoardingPage={this.changeOnboardingPage}
            nextPage={this.getNextPage}
            previousPage={this.getPreviousPage}
          />
        );
      case 'YourProfile':
        return (
          <OnBoardingYourProfile ChangeOnBoardingPage={this.changeOnboardingPage} nextPage={this.getNextPage} previousPage={this.getPreviousPage} />
        );
      case 'New':
        return (
          <OnBoardingNewPage
            ChangeOnBoardingPage={this.changeOnboardingPage}
            nextPage={this.getNextPage}
            previousPage={this.getPreviousPage}
            ChangeSelectedPage={this.changeSelectedPage}
            SelectedPage={this.state.SelectedPage}
          />
        );
      case 'PrivacyPolicy':
        return (
          <OnBoardingPrivacyPolicy ChangeOnBoardingPage={this.changeOnboardingPage} nextPage={this.getNextPage} previousPage={this.getPreviousPage} />
        );
      case 'OnBoardingResponsibility':
        return (
          <OnBoardingResponsibility
            ChangeOnBoardingPage={this.changeOnboardingPage}
            nextPage={this.getNextPage}
            previousPage={this.getPreviousPage}
            SelectedPage={this.state.SelectedPage}
          />
        );
      case 'Create':
        return (
          <OnBoardingCreatePage ChangeOnBoardingPage={this.changeOnboardingPage} nextPage={this.getNextPage} previousPage={this.getPreviousPage} />
        );
      case 'Join':
        return <OnBoardingJoin ChangeOnBoardingPage={this.changeOnboardingPage} nextPage={this.getNextPage} previousPage={this.getPreviousPage} />;
      case 'Import':
        return (
          <OnBoardingImportPage ChangeOnBoardingPage={this.changeOnboardingPage} nextPage={this.getNextPage} previousPage={this.getPreviousPage} />
        );
      case 'Completed':
        window.helper.submitOnBoarding().then(() => {
          //Join is called on the backend UI, why you repeated this? should we call isJoined?
          //window.helper.joinSwash().then(() => {
            this.setState({shouldRedirect: true, CurrentPage: 'Home'});
          //});
        });
        return <div />;
      // Redirect to Settings
      default:
        return '';
    }
  }

  changeOnboardingPage(currentPage) {
    this.setState({CurrentPage: currentPage});
  }

  changeSelectedPage(page, selectedPage) {
    let _onSelectedPage = this.state.onSelectedPage;
    _onSelectedPage[page] = selectedPage;
    this.setState({onSelectedPage: _onSelectedPage});
  }

  render() {
    if (this.state.Flow === []) {
      return '';
    } else {
      return (
        <div id="onboarding-page">
          <React.Fragment>
            {this.state.shouldRedirect ? <Redirect to="/Settings" /> : ''}
            <div>{this.loadOnboarding()}</div>
          </React.Fragment>
        </div>
      );
    }
  }
}

export default OnBoardingPage;
