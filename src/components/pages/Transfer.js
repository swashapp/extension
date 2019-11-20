import React from 'react'
import 'react-widgets/dist/css/react-widgets.css';
import '../../statics/css/custom-notifications.css';
import TransferView from '../microcomponents/TransferView';
import simpleNumberLocalizer from 'react-widgets-simple-number';

simpleNumberLocalizer();


class TransferPage extends React.Component {

    
    render() {
        return (
            <div id="data-page" className="swash-col">
                <React.Fragment>
                    <div className="swash-col">
                         <TransferView />
                    </div>

                </React.Fragment>
            </div>
        );
    }
}


export default TransferPage;