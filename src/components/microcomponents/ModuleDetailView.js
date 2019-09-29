import React from 'react';

import CustomCheckBox from './CustomCheckBox';

class ModuleDetailView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          search_selected: "Bing",
          views: {}
        };
    }

    componentDidMount() {
        if (this.props.module) {
			let views = {};
            let module = this.props.module;
            if (module) {                
				for(let view of module.viewGroups) {
					views[view.name] = {
						name: view.name,
						title: view.title,
						items: []
						}
				}
				let functions = module.functions;
				for(let func of functions) {
					if(module[func]) {
						let index = 0
						for (let item of module[func]) {
							views[item.viewGroup].items.push({
								name: item.name,
								title: item.title,
								description: item.description,
								is_enabled: item.is_enabled,
								func: func,
								index: index
							})
							index++;
						}
					}
				}
			}
            
/*			
			if (module.apiCall) {			  
				let f  = setInterval(()=>{window.helper.isConnected(module.name).then(connected => {
					this.setState({connected:connected})
				});},1000);
				this.setState({intervalId: f});
			}                
*/
			this.setState({
				module: module,
				is_enabled: module.is_enabled,								
				connected: module.access_token?true:false,
				views: views,
			})			
		}
    };

    
    handleOauth(){

    }
  
  
    selectAll(e, state){			
        let views = this.state.views;    
        for (let viewName in views) {
            {
                for (let itemId in views[viewName].items) {
                    views[viewName].items[itemId].is_enabled = state;
                }
            }				
        }
        this.setState({views: views});				
    }


  
  getCollectors(){
    if(! this.state.views)
      return "";
      
    return (<div>
        {this.state.views? Object.keys(this.state.views).map((key,index) =>
          <>
              <div className="module-detail-view-title-container">
                <div className="module-detail-view-title">{this.state.views[key].title}</div>
                {key == 'API'? <>                
                    <a className="oauth_btn" onClick={()=> this.handleOauth()}>Connect to {this.props.module.name}</a>
                    <a className="oauth_btn" onClick={()=> this.handleOauth()}>Connect to {this.props.module.name}</a>
                </>:''}
              </div>
              <div className="checkbox-container">
                {this.state.views[key].items.map( (data, id)=> 
                    <div className="module-detail-view-checkbox" >
                        <label>{/*<input type="checkbox" value={data.name} />*/}

                            <CustomCheckBox  id={this.state.views[key].name + "-" + id} checked={this.state.views[key].is_enabled} handleClick={()=> console.log(data.name) } />
                            <div className="label">{data.title}</div>                        
                        </label>
                    </div>           
                )}
              </div>
          </>)
        :''}
    </div>);
  }


 
        
        


  

  getButtons(){
    return <div style={{height: 40, marginTop: 48}}>
      <a className="module-btn " onClick={(e) => {this.selectAll(e, false)}} style={{width: 112, float:"left"}}>Deselect all</a>
      <a className="module-btn " onClick={(e) => {this.selectAll(e, true)}} style={{width: 112, float:"left"}}>Select all</a>
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
    const collectors = this.getCollectors();    
    const buttons = this.getButtons();
    return (
          <>
              <div className="module-detail-view-description">{this.props.module.description}</div>
              {collectors}              
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