import React from 'react';
import CustomSelect from './CustomSelect';

class OnBoardingYourProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      CurrentPage: 'YourProfileWarning',
      age: '',
    };

    // This binding is necessary to make `this` work in the callback
    // this.XXX = this.XXX.bind(this);
    this.LoadOnBoardingNew = this.LoadOnBoardingNew.bind(this);
    this.goToPreviousPage = this.goToPreviousPage.bind(this);
  }

  LoadOnBoardingNew() {
    this.props.ChangeOnBoardingPage(this.props.nextPage());
  }

  goToPreviousPage() {
    this.props.ChangeOnBoardingPage(this.props.previousPage());
  }

  onSelectChange(item) {
    console.log(item);
    // this.setState({group_selected: item.value});
  }

  render() {
    return (
      <div className="d-flex justify-content-center">
        <React.Fragment>
          <div className="onboarding-box">
            <div className="onboarding-box-header">
              <p>Your Profile</p>
            </div>
            <div className="onboarding-box-body">
              <div style={{display: 'flex', justifyContent: 'center', width: '428px'}}>
                <div style={{flex: '0 0 25%', padding: '0 16px 0 16px'}}>
                  <p className={'onboarding-select-label'}>Gender</p>
                  <CustomSelect
                    items={[
                      {description: 'Non-binary', value: 'Non-binary'},
                      {description: 'Male', value: 'Male'},
                      {description: 'Female', value: 'Female'},
                    ]}
                    className={'onboarding-select-container'}
                    onChange={this.onSelectChange}
                  />
                </div>
                <div style={{flex: '0 0 25%', padding: '0 16px 0 16px'}}>
                  <p className={'onboarding-select-label'}>Age Bracket</p>
                  <CustomSelect
                    items={[
                      {description: '~20', value: '~20'},
                      {description: '20-30', value: '20-30'},
                      {description: '30-40', value: '30-40'},
                      {description: '40-50', value: '40-50'},
                      {description: '50+', value: '50+'},
                    ]}
                    className={'onboarding-select-container'}
                    onChange={this.onSelectChange}
                  />
                </div>
                <div style={{flex: '0 0 25%', padding: '0 16px 0 16px'}}>
                  <p className={'onboarding-select-label'}>Household Income</p>
                  <CustomSelect
                    items={[
                      {description: '~50K', value: '~50K'},
                      {description: '50-75K', value: '50-75K'},
                      {description: '75-150K', value: '75-150K'},
                      {description: '150K+', value: '150K+'},
                    ]}
                    className={'onboarding-select-container'}
                    onChange={this.onSelectChange}
                  />
                </div>
              </div>
            </div>
            <div className="onboarding-box-footer">
              <div className="onboarding-box-footer-left" />
              <div className="onboarding-box-footer-right">
                <div className={'onboarding-proceed-button'} onClick={this.LoadOnBoardingNew}>
                  Proceed
                </div>
                <div style={{float: 'right', cursor: 'pointer'}}>
                  <span onClick={this.goToPreviousPage}>Back</span>
                </div>
              </div>
            </div>
          </div>
        </React.Fragment>
      </div>
    );
  }
}

export default OnBoardingYourProfile;
