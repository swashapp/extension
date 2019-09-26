import React from 'react';

class ModuleDetailView extends React.Component {
  constructor(props) {
    super(props);
    
  }


  render() {
    return (
      <pre style={{padding: 24}}>
              { JSON.stringify( this.props.module, null, 4) }
            </pre>

      );
  }
}

export default ModuleDetailView;