import React from 'react';

class NavBar extends React.Component {
    render() {
        const handleClick = (id)=>{
            if(this.props.handleClick){
                this.props.handleClick(id)
            }
        };
        return <div className={'container-fluid nav-bar-wrapper'}>
            {this.props.navs.map((ob, id) => <div key={id}
                                                  className={'nav ' + (this.props.activeNav === id ? '' : '')}>
                {id !== this.props.navs.length-1 ?
                <div className={'nav-bar-line '+(this.props.activeNav>id?'active':'')}/>
                : ''}
                <div onClick={()=>handleClick(id)} className={'nav-h '+(this.props.activeNav>id?'ok':'')+(this.props.activeNav===id?' nav-selected':'')}>
                    {/*{this.props.activeNav ===id?<i className={'fas '+(id===3?'fa-fingerprint':id===3?'fa-handshake':id===2?'fa-map-marker-alt':id===1?'fa-tasks':'fa-wallet')}/>:id+1}*/}
                </div>
                <div className={'nav-title'}>{ob}</div></div>)}</div>
    }
}

export default NavBar;