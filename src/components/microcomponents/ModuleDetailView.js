import React from 'react';

import CustomCheckBox from './CustomCheckBox';
import CustomSelect from './CustomSelect';
import CustomSnackbar from '../microcomponents/CustomSnackbar';

class ModuleDetailView extends React.Component {
  constructor(props) {    
    super(props);    
    this.state = {
      module: this.props.module,
      views: {},
      connected: false,
      group_selected: this.props.module.viewGroups[0].name,
      intervalId: 0  
    };
    this.onSelectChange = this.onSelectChange.bind(this);
    this.saveSettings = this.saveSettings.bind(this);
  }

  loadSettings() {
    if (this.state.module) {
      let views = {};
      let module = this.state.module;
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

      if (module.apiCall) {			  
        let f  = setInterval(()=>{window.helper.isConnected(module.name).then(connected => {
          this.setState({connected:connected})
        });},1000);
        this.setState({intervalId: f});
      }                
      this.setState({
        module: module,
        is_enabled: module.is_enabled,
        connected: module.access_token ? true : false,
        views: views,
      })
    }
  }

  componentDidMount() {
    this.loadSettings();
  };

  componentDidUpdate(prevProps) {
    if(prevProps.isOpened !== this.props.isOpened) {
      this.loadSettings();
    }      
  }

  componentWillUnmount() {
    clearInterval(this.state.intervalId);
  }

  connect(name){
    window.helper.startAuth(name).then(x => {
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
      for (let itemId in views[viewName].items) {
        views[viewName].items[itemId].is_enabled = state;
      }
    }
    this.setState({ views: views });
  }



  getSettings(settings) {
    for(let func of this.state.module.functions) {
			settings[func] = {};
		}	
    let views = this.state.views
    for (let viewName in views) {
        for (let itemId in views[viewName].items) {
          settings[views[viewName].items[itemId].func][views[viewName].items[itemId].name] = views[viewName].items[itemId].is_enabled;
        }
    }
  }

  saveSettings() {
    var settings = {};
    this.getSettings(settings);
    let moduleName = this.state.module.name;
			return window.helper.configModule(moduleName, settings).then(()=>{
				return window.helper.loadModules().then((modules) => {
					this.setState({						
						module: modules[moduleName]
          })				
          this.refs.notify.handleNotification('Saved successfully', 'success');    
				})
			});	

  }


  onSelectChange(item) {
    this.setState({group_selected: item.value});
  }

  getCollectors() {
    if (!this.state.views)
      return "";
    let selectItems =[];
    this.state.module.viewGroups.map((ob, id) => selectItems.push({description: ob.title, value: ob.name}));
    let searchEngings = (<div>
      <CustomSelect items={selectItems} className={'search-select-container'} menuClassName='search-select-menu' onChange={this.onSelectChange} />
    </div >);

    const dropbox = (<div style={{marginTop: '48px'}}><div className="form-caption">Choose a search engine</div>
      <div>
        {searchEngings}
      </div></div>);

    return (<div>
      {this.state.module.style === 'dropbox' ? dropbox : ''}
      {this.state.views ? Object.keys(this.state.views).map((key, index) =>
        <>
          {((this.state.module.style === 'dropbox' && this.state.group_selected === key) || (this.state.module.style !== 'dropbox')) ? <>
            <div className="module-detail-view-title-container">
              <div className="module-detail-view-title">{this.state.views[key].title}</div>
              {key === 'API' ? <>
                {this.state.connected && this.state.connected !== 'connecting'?
                <div className="oauth_btn" onClick={() => this.disconnect(this.state.module.name)}>Disconnect</div>
                :<div className="oauth_btn" onClick={() => this.connect(this.state.module.name)}>Connect to {this.state.module.name}</div>                
                }
              </> : ''}
            </div>
            <div className="checkbox-container">
              {this.state.views[key].items.map((collector, id) =>
                <div className="module-detail-view-checkbox" >
                  <label>

                    <CustomCheckBox id={this.state.views[key].name + "-" + id} checked={collector.is_enabled} handleClick={(x) => {this.state.views[key].items[id].is_enabled = !x}} />
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
      <a className="module-btn mdv-delete-all-btn-a" onClick={(e) => { this.selectAll(e, false) }} >Deselect all</a>
      <a className="module-btn mdv-select-all-btn-a" onClick={(e) => { this.selectAll(e, true) }} >Select all</a>
      <a className="module-btn mdv-done-btn-a" onClick={this.saveSettings} >Done</a>
    </div>
  }


  render() {
    const collectors = this.getCollectors();
    const buttons = this.getButtons();
    return (
      <>
        <div className="module-detail-view-description">{this.state.module.description}</div>
        {collectors}
        {buttons}
        <CustomSnackbar
                    ref='notify'
                />
      </>
    );
  }

}

export default ModuleDetailView;