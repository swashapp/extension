import React from 'react'
import {        
    MDBTable, MDBTableBody,
    MDBTableHead,        
} from 'mdbreact';
import CustomSnackbar from '../microcomponents/CustomSnackbar';
import CustomSelect from '../microcomponents/CustomSelect';


class AdvancedPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            filters: [],
            masks: [],
            wallets: []
        };
    }

    componentDidMount() {
        window.scrollTo(0, 0);
        let that = this;
        async function loader() {
            let filters = await window.helper.loadFilters();
            let newFilters = [];
            for (let x in filters) {
                newFilters.push({
                    'value': filters[x].value,
                    'type': filters[x].type,
                    'internal': filters[x].internal
                })
            }

            let masks = await window.helper.loadPrivacyData();
            let newMasks = [];
            for (let x in masks) {
                newMasks.push({
                    'value': masks[x].value
                })
            }

            let wallets = await window.helper.loadWallets();
            let newWallets = [];
            for (let x in wallets) {
                newWallets.push({
                    'name': wallets[x].name,
                    'wallet': wallets[x].wallet,
                })
            }

            that.setState({ filters: newFilters, masks: newMasks, wallets: newWallets })
        }
        loader();
    };



    deleteFilterRecord(id) {       
        let newArray = [];
        let storageArray = [];
        for (let i in this.state.filters) {

            if (this.state.filters[i].value !== id) {
                newArray.push(this.state.filters[i]);
                storageArray.push({ type: this.state.filters[i].type, value: this.state.filters[i].value, internal: this.state.filters[i].internal })
            }
            else {
                if(this.state.filters[i].internal) {
                    this.refs.notify.handleNotification('Internal filters can not be removed', 'error');
                    return;
                }
            }
        }
        window.helper.saveFilters(storageArray)
        this.setState({ filters: newArray });
    }

    deleteMaskRecord(id) {
        let newArray = [];
        let storageArray = [];
        for (let i in this.state.masks) {

            if (this.state.masks[i].value !== id) {
                newArray.push(this.state.masks[i]);
                storageArray.push({ value: this.state.masks[i].value })

            }
        }
        window.helper.savePrivacyData(storageArray)
        this.setState({ masks: newArray });
    }

    deleteWallet(name) {
        let newArray = [];
        let storageArray = [];
        for (let i in this.state.wallets) {

            if (this.state.wallets[i].name !== name) {
                newArray.push(this.state.wallets[i]);
                storageArray.push({ name: this.state.wallets[i].name, 'wallet': this.state.wallets[i].wallet })

            }
        }
        window.helper.saveWallets(storageArray)
        this.setState({ wallets: newArray });
    }

    addFilter() {        
        let f = {
            value: document.getElementById('filterValue').value,
            type: this.refs.matchingTypeSelect.getSelectedItem().value,
            internal: false
        };
        if(!f.value || f.value==='undefined') {
            this.refs.notify.handleNotification('Null is not allowed', 'error');
            return;
        }

        let allow = true;
        window.helper.loadFilters().then(filter => {
            for (let i in filter) {
                if (filter[i].value === f.value) {
                    allow = false;
                }
            }
            if (allow) {
                filter.push(f);
                window.helper.saveFilters(filter);
                let i = this.state.filters;
                i.push(f)
                this.setState({ filters: i })
                this.refs.notify.handleNotification('Added successfully', 'success');
            } else {
                this.refs.notify.handleNotification('Duplicate entry', 'error');
            }

        })
    }

    addMask() {
        let f = {
            value: document.getElementById('maskValue').value,
        };

        if(!f.value || f.value==='undefined') {
            this.refs.notify.handleNotification('Null is not allowed', 'error');
            return;
        }

        let allow = true;
        window.helper.loadPrivacyData().then(pData => {
            for (let i in pData) {
                if (pData[i].value === f.value) {
                    allow = false;
                }
            }
            if (allow) {
                pData.push(f);
                window.helper.savePrivacyData(pData);
                let i = this.state.masks;
                i.push(f)
                this.setState({ masks: i })
            } else {
                this.refs.notify.handleNotification('Duplicate entry', 'error');
            }
        })
    }

    AddWallet() {
        let f = {
            name: document.getElementById('walletNameValue').value,
            wallet: document.getElementById('walletAddressValue').value,
        };

        if(!f.name || f.name==='undefined') {
            this.refs.notify.handleNotification('Null is not allowed (name)', 'error');
            return;
        }
        if(!f.wallet || f.wallet==='undefined') {
            this.refs.notify.handleNotification('Null is not allowed (address)', 'error');
            return;
        }
        if(!f.wallet.match('0x[a-fA-F0-9]{40}')) {
            this.refs.notify.handleNotification('Invalid wallet address format', 'error');
            return;
        }

        let allow = true;
        window.helper.loadWallets().then(pData => {
            for (let i in pData) {
                if (pData[i].name === f.name) {
                    allow = false;
                }
            }
            if (allow) {
                pData.push(f);
                window.helper.saveWallets(pData);
                let i = this.state.wallets;
                i.push(f)
                this.setState({ wallets: i })
            } else {
                this.refs.notify.handleNotification('Duplicate name', 'error');
            }
        })
    }

    render() {
        let excludeTableDataRows = this.state.filters.map((row) => {
            return (<tr key={row.value} className="table-row">
                <td className="table-text disabled-url-td"><input type="text" value={row.value} disabled className="disabledUrl" /></td>
                <td className="table-text disabled-matching-type-td"><input type="text" value={row.type} disabled className="disabledMatchingType" /></td>
                <td className="table-text delete-matching-type-td"><a className="linkbutton" onClick={() => this.deleteFilterRecord(row.value)}>Delete</a></td>
            </tr>)
        });
        let addXUrl = (<div><div className="form-caption">Add a URL to exclude</div>
            <div>
                <input type="text" id="filterValue" placeholder="http://example.com" className="form-input  filter-input" />
            </div></div>);
        let selectItems = [{ description: 'Exact', value: 'exact' },
        { description: 'Wildcard', value: 'wildcard' },
        { description: 'Regex', value: 'regex' }]
        let addXType = (<div><div className="form-caption">Matching Type</div>

            <CustomSelect items={selectItems} ref='matchingTypeSelect'/>
        </div >);
        let AddXButton = (<a className="linkbutton add-link-button" onClick={() => this.addFilter()}>Add</a>);


        let maskTableDataRows = this.state.masks.map((row) => {
            return (<tr key={row.value} className="table-row">
                <td className="table-text disabled-masked-text-td"><input type="text" value={row.value} disabled className="disabledMaskedText" /></td>
                <td className="table-text delete-masked-text-td"><a className="linkbutton" onClick={() => { this.deleteMaskRecord(row.value) }}>Delete</a></td>
            </tr>)
        });
        let addMaskText = (<div>
            <div className="form-caption">Add a text mask</div>
            <div>
                <input type="text" id="maskValue" placeholder="Peter" className="form-input mask-input" />
            </div>
        </div>);
        let AddMaskButton = (<a className="linkbutton" onClick={() => this.addMask()}>Add</a>);


        let walletName = (<div><div className="form-caption">Wallet name</div>
            <div>
                <input type="text" id="walletNameValue" placeholder="my wallet" className="form-input " style={{width: 144}} />
            </div></div>);
        let walletAddress = (<div><div className="form-caption">Wallet address</div>
            <div>
                <input type="text" id="walletAddressValue" placeholder="0x123" className="form-input" style={{width: 432}} />
            </div></div>);
        let AddWallet = (<a className="linkbutton" onClick={() => this.AddWallet()}>Add</a>);
        let walletDataRows = this.state.wallets.map((row) =>{
            return (<tr key={row.name} className="table-row">
                <td className="table-text"><input type="text" value={row.name}  style={{width: 144}}disabled className="disabledInput" /></td>
                <td className="table-text"><input type="text" value={row.wallet} style={{width: 432}} disabled className="disabledInput" /></td>
                <td className="table-text"><a className="linkbutton" onClick={() => this.deleteWallet(row.name)}>Delete</a></td>
            </tr>)
        });


        return (
            <div id="advanced-page" className="swash-col">
                <React.Fragment>
                    <div className="swash-col">
                        <div className="setting-part">
                            <div className="swash-head">Text masking</div>
                            <div className="swash-p2">
                                You can mask specific sensitive text data before it is sent to Streamr Marketplace. Your sensitive data is transformed based on the privacy level setting. Examples of text you might want to mask could be your name, email address, and phone number.

</div>

                            <div>
                                <MDBTable>
                                    <MDBTableHead>
                                        <tr className="table-head-row">
                                            <th className="table-text table-head-text add-mask-text-th">{addMaskText}</th>
                                            <th className="table-text table-head-text add-mask-button-th">{AddMaskButton}</th>
                                        </tr>
                                    </MDBTableHead>

                                    <MDBTableBody>
                                        {maskTableDataRows}
                                    </MDBTableBody>
                                </MDBTable>
                            </div>
                        </div>


                    </div>


                    <div className="swash-col">
                        <div className="setting-part">
                            <div className="swash-head">URLs to exclude</div>
                            <div className="swash-p2">This filtering is used to exclude domains and URLs to ensure their data are not going to be sent to Streamr Marketplace. This mechanism is independent of the global filters and can be used to target whatever you would like to exclude. See the docs for more details.</div>


                            <div>
                                <MDBTable>
                                    <MDBTableHead>
                                        <tr className="table-head-row">
                                            <th className="table-head-text add-x-url-th">{addXUrl}</th>
                                            <th className="table-head-text add-x-type-th">{addXType}</th>
                                            <th className="table-head-text add-x-button-th" style={{ width: 90, paddingRight: 0 }}>{AddXButton}</th>
                                        </tr>
                                    </MDBTableHead>

                                    <MDBTableBody>
                                        {excludeTableDataRows}
                                    </MDBTableBody>
                                </MDBTable>
                            </div>
                        </div>

                    </div>

                    <div className="swash-col">
                        <div className="setting-part">
                            <div className="swash-head">Wallets</div>
                            <div className="swash-p2">You can save your wallet addresses.</div>


                            <div>
                                <MDBTable>
                                    <MDBTableHead>
                                        <tr className="table-head-row">
                                            <th className="table-head-text">{walletName}</th>
                                            <th className="table-head-text">{walletAddress}</th>
                                            <th className="table-head-text" style={{ width: 90, paddingRight: 0 }}>{AddWallet}</th>
                                        </tr>
                                    </MDBTableHead>

                                    <MDBTableBody>
                                        {walletDataRows}
                                    </MDBTableBody>
                                </MDBTable>
                            </div>
                        </div>

                    </div>



                </React.Fragment>
                <CustomSnackbar
                    ref='notify'
                />

            </div>
        );
    }
}

export default AdvancedPage;