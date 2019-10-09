import React from 'react';

import CustomCheckBox from './CustomCheckBox';
import CustomSelect from './CustomSelect';

class ModuleDetailView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      views: {},
      connected: false,
      group_selected: this.props.module.viewGroups[0].name
    };
    this.onSelectChange = this.onSelectChange.bind(this);
  }

  

  componentDidMount() {
    if (this.props.module) {
      let views = {};
      let module = this.props.module;
      if (module) {
        for (let view of module.viewGroups) {
          views[view.name] = {
            name: view.name,
            title: view.title,
            items: []
          }
        }
        let functions = module.functions;
        for (let func of functions) {
          if (module[func]) {
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
        connected: module.access_token ? true : false,
        views: views,
      })
    }
  };

  componentDidUpdate(prevProps) {

  }

  connect(name){
    window.helper.startAuth(name).then(x => {
      let moduleName = this.state.name;                                               
              this.setState({connected:'connecting'})				
    });
  }
  
  disconnect(name){
    window.helper.removeAuth(name).then(x => {      
      window.helper.isConnected(name).then(connected => {
        this.setState({connected: connected});
      });
    });
  }



  selectAll(e, state) {
    let views = this.state.views;
    for (let viewName in views) {
      {
        for (let itemId in views[viewName].items) {
          views[viewName].items[itemId].is_enabled = state;
        }
      }
    }
    this.setState({ views: views });
  }



  getSettings(settings) {
    let views = this.state.views
    for (let viewName in views) {
      {
        for (let itemId in views[viewName].items) {
          let f = document.getElementById(viewName + "-" + itemId).checked;
          settings[views[viewName].items[itemId].func][views[viewName].items[itemId].name] = f;
        }
      }
    }
  }


  onSelectChange(item) {
    this.setState({group_selected: item.value});
  }

  getCollectors() {
    if (!this.state.views)
      return "";
    let selectItems =[];
    this.props.module.viewGroups.map((ob, id) => selectItems.push({description: ob.title, value: ob.name}));
    let searchEngings = (<div>
      <CustomSelect items={selectItems} className={'search-select-container'} menuClassName='search-select-menu' onChange={this.onSelectChange} />
    </div >);

    const dropbox = (<div style={{marginTop: '48px'}}><div className="form-caption">Choose a search engine</div>
      <div>
        {searchEngings}
      </div></div>);

    return (<div>
      {this.props.module.style === 'dropbox' ? dropbox : ''}
      {this.state.views ? Object.keys(this.state.views).map((key, index) =>
        <>
          {((this.props.module.style === 'dropbox' && this.state.group_selected === key) || (this.props.module.style != 'dropbox')) ? <>
            <div className="module-detail-view-title-container">
              <div className="module-detail-view-title">{this.state.views[key].title}</div>
              {key == 'API' ? <>
                {this.state.connected && this.state.connected != 'connecting'?
                <a className="oauth_btn" onClick={() => this.disconnect(this.props.module.name)}>Disconnect</a>
                :<a className="oauth_btn" onClick={() => this.connect(this.props.module.name)}>Connect to {this.props.module.name}</a>                
                }
              </> : ''}
            </div>
            <div className="checkbox-container">
              {this.state.views[key].items.map((collector, id) =>
                <div className="module-detail-view-checkbox" >
                  <label>{/*<input type="checkbox" value={data.name} />*/}

                    <CustomCheckBox id={this.state.views[key].name + "-" + id} checked={collector.is_enabled} handleClick={(x) => {/*this.state.views[key].items[id].is_enabled = x*/ }} />
                    <div className="label">{collector.title}</div>
                  </label>
                </div>
              )}
            </div>
          </> : ''}
        </>)
        : ''}
    </div>);
  }









  getButtons() {
    return <div style={{ height: 40, marginTop: 32 }}>
      <a className="module-btn " onClick={(e) => { this.selectAll(e, false) }} style={{ width: 112, float: "left" }}>Deselect all</a>
      <a className="module-btn " onClick={(e) => { this.selectAll(e, true) }} style={{ width: 112, float: "left" }}>Select all</a>
      <a className="module-btn " style={{ width: 72, float: "right" }}>Done</a>
    </div>
  }


  render() {
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

}

export default ModuleDetailView;