import React, { Fragment } from "react";
import { Route, Switch ,withRouter} from 'react-router-dom';
import {
    MDBCol,
    MDBSwitch,
    MDBRow,
    MDBCard,
    MDBCardBody,
    MDBInput,
    MDBBtn,
    MDBTooltip,
    MDBCardTitle,
    MDBContainer,
    MDBTable,
    MDBTableHead,
    MDBModal,
    MDBTableBody,
    MDBModalBody,
    MDBModalHeader,
    MDBModalFooter,
	MDBIcon,
	MDBView
} from "mdbreact";
import NavBar from '../microcomponents/NavBar'

class Marketplace extends React.Component {
    state = {
        modules: [],
		rows: []
    };

    componentDidMount() {
    };

    componentDidUpdate() {
    }
	
	generateRows(modules){
		let id = 0;
		var result = [];
		for(module of modules){
			id++;
			let owner = "fa fa-times-circle mr-2 red-text";
			if(module.is_verified){
				owner = "fa fa-check-circle mr-2 green-text";
			}
			
			let x = {						
				'id': <MDBInput label={id} type="checkbox" id={'cb'+id} />,
				'name': module.name,
				'domain': module.URL[0],
				'owner': [<i key="owner" className={owner} aria-hidden="true"></i>],
				'totalPay': module.totalPay
			  }
			result.push(x);		
		}
		return result;
	}

	render(){
	   const data_icons = {
			columns: [
			  {
				'label': '#',
				'field': 'id',
				'sort': 'asc'
			  },
			  {
				'label': [<i key="name" className="fa fa-user mr-2 teal-text" aria-hidden="true"></i>, 'Name'],
				'field': 'name',
				'sort': 'asc'
			  },
			  {
				'label': [<i key="domain" className="fa fa-internet-explorer mr-2 teal-text" aria-hidden="true"></i>, 'Domain'],
				'field': 'domain',
				'sort': 'asc'
			  },
			  {
				'label': [<i key="owner" className="fa fa-check-circle mr-2 teal-text" aria-hidden="true"></i>, 'Is domain owner?'],
				'field': 'owner',
				'sort': 'asc'
			  },
			  {
				'label': [<i key="totalPay" className="fa fa-dollar-sign mr-2 teal-text" aria-hidden="true"></i>, 'Total Pay'],
				'field': 'totalPay',
				'sort': 'asc'
			  }
			],
			rows: this.state.rows
		};
		const modules = [{"name":"Streamr","description":"This module look through all the user activities on Streamr and capture those activities that user have permitted","URL":["https://*.streamr.com/*"],"viewGroups":[{"name":"Survey","title":"Surveys"},{"name":"Debug","title":"Debug and Error Logs"},{"name":"cta","title":"Context Attributes"},{"name":"devtools","title":"Network Debugging Tools"},{"name":"task","title":"UX Tasks"}],"is_available":true,"is_enabled":true,"privacy_level":0,"icons":["data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAMAAADVRocKAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3ZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDphMWNkMWYwYS0yZGU2LWIyNDQtOWY3YS1mODQyNDJlYmNjZjYiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6Njk2MTYyNTczMUI1MTFFOUJCQTFGN0QwMDRBQjNGMjUiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6Njk2MTYyNTYzMUI1MTFFOUJCQTFGN0QwMDRBQjNGMjUiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKFdpbmRvd3MpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6YTFjZDFmMGEtMmRlNi1iMjQ0LTlmN2EtZjg0MjQyZWJjY2Y2IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOmExY2QxZjBhLTJkZTYtYjI0NC05ZjdhLWY4NDI0MmViY2NmNiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pud1Tn8AAAMAUExURf92HP+CMf/BnP+GNv+GOv/28f/Jpv+8lv+mcf9ZAP+RSf9wEv9rCP/ey//v5P95Kf/z6/9vD//axv+xhP/Hpf/Eov+vef+WVf/NsP/Jq//Tu/+aXv+VTv9+Lf/g0P9sEv9sCv/dx//s4//+/v+6kP/9/P9mCP/Lrf/q4P99J/+MQf/Wuv+wgf9/Mf+ZVf/Qtf9mAv/Mqv/ezf+lbf/69/+vf//38v+KQP+pdf90GP/p2v9yFP/m1v/k0v/i0P9WAP/gzP+DNf+KPP/Xvf+XUv/UvP/UuP9xGv/39P+FM/9/Kv+PRf+2i/+TUf9+KP/49v97I//07P+cXv/w5v+cWv/u4v9pBf/p3f/l1f/i0//izv+QRv/cxP/Xv/+JO//Qsf+ALf9qEv95I/94Hv+/mf92Gv92Iv+3h/9zF/9rD/9iBP/18f+fX/+bWf/o2f+WUP+UUf/n2f+UTP/j1P/ayf+IOf/Rs//Nr/+CLv+1iP9vF/+td/+pe/9oCv9pB/+jaP+fYf+dY/+aV/+ZW/+OQv+IPP9sD/9oCP9kBv9kBP9lAP9eAP9dAP9kAP9gAP9iAP9jAP9fAP9hAP9cAP/59f/q3P9qBv/+/f/s4P/x6P/r3v+AK//8+v9uDf/r3f98Jf/17//6+P/7+P/48/+LPv/07v/17v/9+//y6f/Ut//gzv/m1f/Fof/q3//awv/Zv//9/v/fyv/x6f/Rt//Ttf+JP/96If+YU//NrP/Orf/ZwP/7+v+ref/t4v/7+f/8+/+ja/9rC//s4f97K/9yH/+RUP+MP/+re/9hAf/4+P+iZ//18v/Fo/+8k/+ncv+eZf/DoP+bYP9iA/+bZP9tC//z7f90F/9mBP+ugf+aW/+4jf/k1v95H//WwP9iAf/r4P/dy//Ttv/Pr//t5P/v5f/PtP/Yw//awf/BmP9wFf+peP+1hP+0h/+2hf+haP/q3v9fAv/w6P/w6f+KSf+dYP9lAf+eXf+tfP+gYP/49P/49f/p3/9nBv////9mAP///5WMlC4AAAEAdFJOU////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////wBT9wclAAAGX0lEQVR42syad1wURxTHD+GMd5wFAQmIKBJiAMUzYi+oWBBNokYxMX7UEDSWqLEblU/smt293WuAIFgQFbvYGxolphg1zRSjxhRMNNE0E1PfJLt7IAfszO7eLZ+P7x/43M7+vrszb+a9ebO6/2rZdA8UoPhOfJ/C+B+KawmQFGtGoplj42oDsBC52ULNAdl/oir2Ura2gOh7qJrdi9YSsHU4qmHDt2oHkNJHaGqeVoC8qUjSlp7UBpAXjzAWf1ILQMFhhLXDBd4DCvoigvVN8BZQMB0RLTzBO0BCOELeEcgA50wkazOdngOU6CNkdHoK2GREisy4yTOAUn2EntvkCaDjIKTYBnVUD1Cjj9ByvVqAfjlSZbF6dYANsVgpCyVN2KAGsOVNnLzVbkqVvlK4RTlgSyFWXxf60zBa+lqfoUoBQ8dg+4fpAHCCwVwcM1QZoBFeH3FpehiGA6AxjZQAGs0hOIsldSSEOyjeJC/7FskDinxJ3mgzl0HwZLOZsjM2ZYTqgByCPsWxDU/kATz+7Kzt+2+H2KTewjeHDMgZiNdnLW/UewoqLXCVFGFgDgnwNF6fcpS2TRaFr//qArR9TXIgBpbhAWU++NHN+EwPMGNR4CkIed4vpDXsDXzUIt3UpwEO0GA+vn8cafwzn5+UOOAdaG9gGXpxLGPBtZ3fQBowgqDPfR+RDcFvc6wfOM8K/kOzBF8bVyIFKBlHuIUOAui32oosza9d/9ciu7auXVMTsGYtaX4xnWFjM/7JqdVhEELLr94pa6oDclMQaYGYvRFmcLyw1f8beJ1REB9ScqsCcmNIrelH+BGOvtGbtiDH+7BYCQDFrHMHZBL1Kfs10fE3Ns2g2fqwVBEAxWRWAjLXk9syF8on7z/z5gG8mmilLAoI67tWAIpSZJoKUaDSNgRP+HSlzUrJEp4sKgfEy7XkGm53J8Cg9i3rDTAzVrn7DrsAcfJvy05KP+4GWLYfQB9xsTkj9xZxIkBJAmqle9f5/N0KQKsz4p+RH7AyYxEuAHLyFTmFnXY0e3lRiai8N6qclD6ZTAjI4QHHFCdXdtpQOqvKYED6h+RbknhAXTUJnGEYwMW7JyLOXz4lAqL87MT2QTwgSA2ANvI+lOgwc47GIiCMIffRTh6wTRXgMsB0G6Iors0ucU4MXkkkzOUBmalqAMug/gDR/w2vuEbBh9RHWSN5QLavCoDNCBELxGe2TugnAow2QnPfbGEe3FQB4NKSYaorHtgN6by+3o8U2m6KE805TjnAYroOfV2A3z8SxjnwZ1Jgc7rWosgWZFHO7f+AfXCOcaH2CT10jrB2myIrlusjWST9iWl2t/Q9uTyiUeYIXj9Zx2FvTG1XGXDaEQiOzlMO3h9Ie7OoWZMsLoAwqVvhhzirnXvIxL8DlfElhBoqnJ31hYgJopvaVkQDbC7FOmnWkapB/6gJtwD58OF4cEUWx/YBqCN0EWW7wS8UIdgRMB2tnraMNZGiWSjt6mu2E8BtQdXwG/9ra7z+1zUTLwyBPZsgEIIWOITeoMMBOjOIczzxN8CFL3DLhGmsVOo4V9pbGaMYaHID29jsiH4PoL2DXnAhCqYsoXH6LeZKJ78HLkkT/K5cieQRx4NLbYl/AIQYlrQE6NnGgQuYLQ7g0vdt0gT2dCrdVkyMwh4qA9g1W1inm2MTyEtf4Tcg/fMxm3vWJ/SXyjj28cNNM7D+eak/aQsVhwvQHH3rx36PNRZmb9jdWyy2+1F+HHkTmJSPTyy409bV53kvSiQkRNX1a25jkwLwOaqFonsDvEVY3wKS5Dfie/xJSWQ9gA54QMAeJaWE7wgEeifAYCzA/5iyYshuf/xW/FuAujgH9d+ttJwzGkegrK34vAgD8B+tvCAV2Q1HWHWwk1l6BncbraakhiewLEY/Ul1RsHiiuqJgt2K1Zc3iLmr0PylWX5jtpYLQpZcnpeVRXTTQJxbHe+qU6etGeVre76GIoOvh+QGFEgJZX+6I5Zmrcvov9PDukGiHDOHqDm+PubofIukf6u79Qd20Id7oKzlq7IolDJmmzWFp1/WkcooWx73S5aQYJfoKD6zXxeBLWtocudcs6d0vymn00UD1omRlWVGrzx5GVDlWmDNC++8qnE3uJ335Tf6qlU9P1r1YON5kGl94J7P2Pp7ZfKZk8wP2dc7/AgwACGjFeBaalSMAAAAASUVORK5CYII="],"version":1,"style":{"mainColor":"ff5c00","fontColor":"fff"},"type":"marketplace","is_verified":true,"browsing":[{"name":"PageNotFound","title":"Page Not Found","viewGroup":"Debug","hook":"response","description":"","pattern":[{"statusCode":404}],"is_enabled":false},{"name":"InternalSeverError","title":"Internal Server Error","viewGroup":"Debug","hook":"response","description":"","pattern":[{"statusCode":500}],"is_enabled":false}],"content":[{"name":"Errors","description":"","title":"Errors","viewGroup":"Debug","type":"event","is_enabled":false,"events":[{"selector":"","event_name":"error"}],"objects":[{"selector":"","property":"location","name":"url","type":"url"},{"selector":".","property":"colno","name":"columnNumber","type":"text"},{"selector":".","property":"filename","name":"filename","type":"url"},{"selector":".","property":"lineno","name":"lineNumber","type":"text"},{"selector":".","property":"message","name":"MessageError","type":"text"}]},{"name":"ConsoleErrors","description":"","title":"Console Errors","viewGroup":"Debug","type":"log","is_enabled":false},{"name":"ConsoleWarns","description":"","title":"Console Warnings","viewGroup":"Debug","type":"log","is_enabled":false},{"name":"ConsoleLogs","description":"","title":"Console Logs","viewGroup":"Debug","type":"log","is_enabled":false}],"context":[{"name":"agent","description":"","title":"User Agent","viewGroup":"cta","is_enabled":false,"type":"browser"},{"name":"installedPlugins","description":"","title":"installed Plugins","viewGroup":"cta","is_enabled":false,"type":"browser"},{"name":"platform","description":"","title":"Platform","viewGroup":"cta","is_enabled":false,"type":"browser"},{"name":"language","description":"","title":"Browser Language","viewGroup":"cta","is_enabled":false,"type":"browser"},{"name":"proxyStatus","description":"","title":"Proxy Status","viewGroup":"cta","is_enabled":false,"type":"browser"},{"name":"screenshot","description":"","title":"Screenshot","viewGroup":"cta","is_enabled":false,"type":"browser"},{"name":"resolution","description":"","title":"Screen Resolution","viewGroup":"cta","is_enabled":false,"type":"content"},{"name":"scroll","description":"","title":"Window Scroll","viewGroup":"cta","is_enabled":false,"type":"content"},{"name":"windowSize","description":"","title":"Window Size","viewGroup":"cta","is_enabled":false,"type":"content"},{"name":"cache","description":"","title":"Caches","viewGroup":"cta","is_enabled":false,"type":"content"}],"devtools":[{"name":"Status","title":"Status","viewGroup":"devtools","is_enabled":false,"conditions":[{"object":"status","operator":"!=","value":"200"}]},{"name":"Time","title":"Time","viewGroup":"devtools","is_enabled":false,"conditions":[{"object":"time","operator":">","value":"2000"}]}],"survey":[{"name":"UX Test","title":"UX Test","viewGroup":"Survey","is_enabled":false,"pages":[{"name":"page1","elements":[{"type":"checkbox","name":"SurfStreamr-page1-question1","title":"q1","choices":["item1","item2","item3"]},{"type":"dropdown","name":"SurfStreamr-page1-question2","title":"q2","choices":["item2-1","item2-2"]}]},{"name":"page2","elements":[{"type":"radiogroup","name":"SurfStreamr-page2-question1","title":"q3","choices":["item3-1","item3-2"]}]}]}],"task":[{"name":"LoginTask","description":"","title":"LoginTask","viewGroup":"task","is_enabled":false,"startEvent":{"selector":"form.root_32zpi","event_name":"submit"},"endEvent":{"selector":"window","event_name":"load"},"conditions":[{"selector":"document","property":"URL","operator":"=","value":"https://www.streamr.com/canvas/editor"}]}],"functions":["content","browsing","survey","context","devtools","task"],"content_matches":["https://*.streamr.com/*"],"browsing_matches":["https://*.streamr.com/*"],"survey_matches":["https://*.streamr.com/*"],"context_matches":["https://*.streamr.com/*"],"devtools_matches":["https://*.streamr.com/*"],"task_matches":["https://*.streamr.com/*"],"totalPay":"20000"}];
		const saveToModules = () => {
			let modules = this.state.modules;
			let resModules = {};
			let counter = 0;
			for(let moduleId in modules){
				counter++;
				let id = 'cb' + counter;
				if(document.getElementById(id).checked)
					resModules[modules[moduleId].name] = modules[moduleId]					
			}
			window.helper.saveModule(resModules).then(x => {
				window.helper.restart();
				this.props.reload();
			});
		};
		const search = (e) => {
			if (e.key != 'Enter') {
				return;
			}
			let query = document.getElementById("search").value;
			var result = [];
			let id = 0;
			this.state.modules = [];
			for(let module of modules){
				if(module.name.toLowerCase().indexOf(query) >= 0 || module.URL[0].toLowerCase().indexOf(query) >= 0)
				{
					if(module.is_available) {
						this.state.modules.push(module);
						id++;						
					}
				}
			}
			this.setState({rows:this.generateRows(this.state.modules)});
		}
		return (
		<MDBRow>
			<MDBCol md="12">
				<MDBCard className="mt-5">
					<MDBView className="gradient-card-header blue darken-1">
						<h4 className="h4-responsive text-white">Search New Module</h4>
					</MDBView>
					<MDBCardBody>
						<MDBCol md="10">					
							<div className="input-group-prepend">
								<span  id="basic-text1">
									<MDBIcon icon="search" />
								</span>
								<input id="search" onKeyPress={search} className="form-control form-control-sm ml-3 w-75" type="text" placeholder="Search" aria-label="Search" />					
							</div>
						</MDBCol>
						<br/>
						<MDBTable btn fixed>
						  <MDBTableHead columns={data_icons.columns} />
						  <MDBTableBody rows={data_icons.rows} />
						</MDBTable>
						<Fragment>
						  <MDBBtn active onClick={saveToModules} color="primary">Save To Modules</MDBBtn>
						</Fragment>
					</MDBCardBody>
				</MDBCard>
			</MDBCol>
		</MDBRow>
	  );
  }
}

export default withRouter(Marketplace);