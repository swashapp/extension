import React from 'react';

class ModuleDetailView extends React.Component {
  constructor(props) {
    super(props);
    
  }


  getBrowsing(){
    if(! this.props.module.browsing)
      return "";
    return (<div>
      <div className="module-detail-view-title">Select behaviour to be captured</div>
      <div>
        {this.props.module.browsing.map( (data, id)=> <div>
            <input type="checkbox" />{data.name}</div>
          )}
      </div>
    </div>);
  }


  getAPI(){
    if(! this.props.module.apiCall)
      return "";
    return (<div>
      <div>
        <div className="module-detail-view-title">Select behaviour to be captured via {this.props.module.name} API</div>
        <button >Connect to {this.props.module.name}</button>
      </div>
      <div>
      {this.props.module.apiCall.map( (data, id)=> <div className="module-detail-view-checkbox-label">
            <input type="checkbox"  />{data.name}</div>
          )}
      </div>
    </div>);
  }


  getContent(){
    if(! this.props.module.content)
      return "";
    return (<div>
      <div className="module-detail-view-title">Content Script title</div>
      <div>
      {this.props.module.content.map( (data, id)=> <div>
            <input type="checkbox" />{data.name}</div>
          )}
        
      </div>
    </div>);
  }

  render() {
    const browsing = this.getBrowsing();
    const api = this.getAPI();
    const content = this.getContent();
    return (
          <>
              <div className="module-detail-view-description">{this.props.module.description}</div>
              {browsing}
              {content}
              {api}
          </>
      );
  }
}

export default ModuleDetailView;