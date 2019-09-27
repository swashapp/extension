import React from 'react';

import CustomCheckBox from './CustomCheckBox';

class ModuleDetailView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      search_selected: "Bing"
    };
  }

  handleOauth(){

  }

  getBrowsing(){
    if(! this.props.module.browsing)
      return "";
    return (<div>
      <div className="module-detail-view-title-container">
        <div className="module-detail-view-title">Select behaviour to be captured</div>
      </div>
      <div className={(this.props.module.browsing.length>5)?"checkbox-container":""}>
        {this.props.module.browsing.map( (data, id)=> 
            <div className="module-detail-view-checkbox" >
            <label>{/*<input type="checkbox" value={data.name} />*/}

<CustomCheckBox handleClick={()=> console.log(data.name) } />
            <div className="label">{data.title}</div></label>
          </div>
          )}
      </div>
    </div>);
  }


  getAPI(){
    if(! this.props.module.apiCall)
      return "";
    return (<div>
      <div className="module-detail-view-title-container">
        <div className="module-detail-view-title">Select behaviour to be captured via {this.props.module.name} API</div>
        <a className="oauth_btn" onClick={()=> this.handleOauth()}>Connect to {this.props.module.name}</a>
      </div>
      <div className={(this.props.module.apiCall.length>5)?"checkbox-container":""}>
      {this.props.module.apiCall.map( (data, id)=> 
          <div className="module-detail-view-checkbox" >
            <label>
<CustomCheckBox handleClick={()=> console.log(data.name) } />
{/*<input type="checkbox" value={data.name} />*/}<div className="label">{data.title}</div></label>
          </div>
          )}
      </div>
    </div>);
  }


  getContent(){
    if(! this.props.module.content)
      return "";
    return (<div>
      <div className="module-detail-view-title-container">
        <div className="module-detail-view-title">Content Script title</div>
      </div>
      <div className={(this.props.module.content.length>5)?"checkbox-container":""}>
      {this.props.module.content.map( (data, id)=> 
            <div className="module-detail-view-checkbox" >
            <label><CustomCheckBox handleClick={()=> console.log(data.name) } />
          {/*<input type="checkbox" value={data.name} />*/}<div className="label">{data.title}</div></label>
          </div>
          )}
        
      </div>
    </div>);
  }

  getButtons(){
    return <div style={{height: 40, marginTop: 48}}>
      <a className="module-btn " style={{width: 112, float:"left"}}>Deselect all</a>
      <a className="module-btn " style={{width: 112, float:"left"}}>Select all</a>
      <a className="module-btn " style={{width: 72, float:"right"}}>Done</a>
    </div>
  }
  
  render_search(){
    const dropbox = (<div><div className="form-caption">Choose a search engine</div>
                            <div>
                        <select id='filterOption' 
                        className="browser-default custom-select" 
                        onChange={(e)=> this.setState({value: e.target.value})}
                        defaultValue={this.state.search_selected}
                        >
                          {this.props.module.viewGroups.map((ob,id)=>  <option value={ob.name}>{ob.title}</option>)}
                        </select>
                            </div></div>);
    let chks = this.props.module.browsing.filter((ob)=> ob.viewGroup == this.state.search_selected);
    chks = chks.concat( this.props.module.content.filter((ob)=> ob.viewGroup == this.state.search_selected));
    const checkbox = (<div className={"checkbox-container"} style={{marginTop:48}}>
      {chks.map( (data, id)=> 
            <div className="module-detail-view-checkbox" >
            <label><CustomCheckBox handleClick={()=> console.log(data.name) } /><div className="label">{data.title}</div></label>
          </div>
          )}
        
      </div>);
    const buttons = this.getButtons();
    return (
          <>
              <div className="module-detail-view-description">{this.props.module.description}</div>
              {dropbox}
              {checkbox}
              {buttons}
          </>
      );
  }

  render_other(){
    const browsing = this.getBrowsing();
    const api = this.getAPI();
    const content = this.getContent();
    const buttons = this.getButtons();
    return (
          <>
              <div className="module-detail-view-description">{this.props.module.description}</div>
              {browsing}
              {content}
              {api}
              {buttons}
          </>
      );
  }

  render() {
    if(this.props.module.name == "Search")
      return this.render_search();
    else
      return this.render_other();
  }
}

export default ModuleDetailView;