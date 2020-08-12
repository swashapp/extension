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

class OnBoardingPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      CurrentPage: 'Welcome',
      SelectedPage: 'Create',
      isUpdate: false,
      shoudlRedirect: false,
    };

    // This binding is necessary to make `this` work in the callback
    // this.XXX = this.XXX.bind(this);
    this.getNextPage = this.getNextPage.bind(this);
    this.getPreviousPage = this.getPreviousPage.bind(this);
    this.LoadOnBoarding = this.LoadOnBoarding.bind(this);
    this.ChangeOnBoardingPage = this.ChangeOnBoardingPage.bind(this);
    this.ChangeSelectedPage = this.ChangeSelectedPage.bind(this);
  }

  componentDidMount() {
    window.helper.isExtensionUpdated().then((result) => {
      this.setState({isUpdate: result});
    });
  }

  getNextPage() {
    let isUpdate = this.state.isUpdate;
    let current = this.state.CurrentPage;
    let selected = this.state.SelectedPage;

    if (current === 'Welcome') {
      if (isUpdate) return 'PrivacyPolicy';
      else return 'YourProfileWarning';
    } else if (current === 'YourProfileWarning') return 'YourProfile';
    else if (current === 'YourProfile') return 'New';
    else if (current === 'New') return 'PrivacyPolicy';
    else if (current === 'PrivacyPolicy') return 'OnBoardingResponsibility';
    else if (current === 'OnBoardingResponsibility') {
      if (isUpdate) return 'Completed';
      else return selected;
    } else if (current === selected) return 'Completed';
  }

  getPreviousPage() {
    let isUpdate = this.state.isUpdate;
    let current = this.state.CurrentPage;
    let selected = this.state.SelectedPage;

    if (current === 'YourProfileWarning') return 'Welcome';
    if (current === 'YourProfile') return 'YourProfileWarning';
    if (current === 'New') return 'YourProfile';
    else if (current === 'PrivacyPolicy') {
      if (isUpdate) return 'Welcome';
      else return 'New';
    } else if (current === 'OnBoardingResponsibility') return 'PrivacyPolicy';
    else if (current === selected) return 'OnBoardingResponsibility';
  }

  LoadOnBoarding() {
    let page = this.state.CurrentPage;
    switch (page) {
      case 'Welcome':
        return (
          <OnBoardingWelcomePage ChangeOnBoardingPage={this.ChangeOnBoardingPage} nextPage={this.getNextPage} previousPage={this.getPreviousPage} />
        );
      case 'YourProfileWarning':
        return (
          <OnBoardingYourProfileWarning
            ChangeOnBoardingPage={this.ChangeOnBoardingPage}
            nextPage={this.getNextPage}
            previousPage={this.getPreviousPage}
          />
        );
      case 'YourProfile':
        return (
          <OnBoardingYourProfile ChangeOnBoardingPage={this.ChangeOnBoardingPage} nextPage={this.getNextPage} previousPage={this.getPreviousPage} />
        );
      case 'New':
        return (
          <OnBoardingNewPage
            ChangeOnBoardingPage={this.ChangeOnBoardingPage}
            nextPage={this.getNextPage}
            previousPage={this.getPreviousPage}
            ChangeSelectedPage={this.ChangeSelectedPage}
            SelectedPage={this.state.SelectedPage}
          />
        );
      case 'PrivacyPolicy':
        return (
          <OnBoardingPrivacyPolicy ChangeOnBoardingPage={this.ChangeOnBoardingPage} nextPage={this.getNextPage} previousPage={this.getPreviousPage} />
        );
      case 'OnBoardingResponsibility':
        return (
          <OnBoardingResponsibility
            ChangeOnBoardingPage={this.ChangeOnBoardingPage}
            nextPage={this.getNextPage}
            previousPage={this.getPreviousPage}
            SelectedPage={this.state.SelectedPage}
          />
        );
      case 'Create':
        return (
          <OnBoardingCreatePage ChangeOnBoardingPage={this.ChangeOnBoardingPage} nextPage={this.getNextPage} previousPage={this.getPreviousPage} />
        );
      case 'Import':
        return (
          <OnBoardingImportPage ChangeOnBoardingPage={this.ChangeOnBoardingPage} nextPage={this.getNextPage} previousPage={this.getPreviousPage} />
        );
      case 'Completed':
        window.helper.submitOnBoarding().then(() => {
          this.setState({shoudlRedirect: true, CurrentPage: 'Home'});
        });
        return <div />;
      // Redirect to Settings
      default:
        return 'Welcome';
    }
  }

  ChangeOnBoardingPage(CurrentPage) {
    this.setState({CurrentPage: CurrentPage});
  }

  ChangeSelectedPage(SelectedPage) {
    this.setState({SelectedPage: SelectedPage});
  }

  render() {
    return (
      <div id="onboarding-page">
        <React.Fragment>
          {this.state.shoudlRedirect ? <Redirect to="/Settings" /> : ''}
          <div>{this.LoadOnBoarding()}</div>
        </React.Fragment>
      </div>
    );
  }
}

export default OnBoardingPage;
