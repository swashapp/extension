import React from 'react'
import 'react-widgets/dist/css/react-widgets.css';
import '../../statics/css/custom-notifications.css';
import TransferView from '../microcomponents/TransferView';
import simpleNumberLocalizer from 'react-widgets-simple-number';


simpleNumberLocalizer();


class TransferPage extends React.Component {

    
    render() {
        const location = this.props.location.pathname.split("/");
        let params = [];
        if(location.length > 2){
            params = location.slice(2)
        }

        return (
            <div id="data-page" className="swash-col">
                <React.Fragment>
                    <div className="swash-col">
                         <TransferView extraParams={params} />
                    </div>

                </React.Fragment>
            </div>
        );
    }
}


export default TransferPage;