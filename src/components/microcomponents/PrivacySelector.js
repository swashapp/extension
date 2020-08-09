import React from 'react';

class PrivacySelector extends React.Component {
  render() {
    const navs = ['LOW', 'MEDIUM', 'HIGH'];
    const handleClick = (id) => {
      if (this.props.handleClick) {
        this.props.handleClick(id);
      }
    };

    return (
      <div className={'privacy-selector-wrapper'}>
        {navs.map((ob, id) => (
          <>
            {id !== navs.length - 1 ? (
              <div
                className={'privacy-nav-bar-line ' + (this.props.activeNav > id ? 'active' + this.props.activeNav : '')}
                style={{top: 0, left: (id * 100) / (navs.length - 1) + '%', width: 100 / (navs.length - 1) + '%'}}
              />
            ) : (
              ''
            )}

            <div
              className={
                'privacy-nav-h ' +
                (this.props.activeNav > id ? 'ok' + this.props.activeNav : '') +
                (this.props.activeNav === id ? ' privacy-nav-selected' + this.props.activeNav : '')
              }
              style={{top: 0, left: (id * 100) / (navs.length - 1) + '%'}}></div>

            <div onClick={() => handleClick(id)} className={'privacy-nav-wrapper'} style={{top: 0, left: (id * 100) / (navs.length - 1) + '%'}}></div>

            {this.props.activeNav === id ? (
              <div
                onClick={() => handleClick(id)}
                className={'privacy-nav-h privacy-nav-selected'}
                style={{top: 0, left: (id * 100) / (navs.length - 1) + '%'}}></div>
            ) : (
              ''
            )}

            <div
              className={`privacy-label ${this.props.activeNav === id ? 'privacy-label-selected' : ''}`}
              style={{position: 'absolute', top: 32, left: 'calc(' + (id * 100) / (navs.length - 1) + '% - ' + ob.length * 4 + 'px)'}}>
              {ob}
            </div>
          </>
        ))}
      </div>
    );
  }
}

export default PrivacySelector;
