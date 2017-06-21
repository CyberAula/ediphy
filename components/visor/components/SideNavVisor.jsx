import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import i18n from 'i18next';
import Dali from '../../../core/main';
import VisorNavSection from './VisorNavSection';

export default class SideNavVisor extends Component {
    constructor(props) {
        super(props);
    }

    render() {

        console.log(Dali.i18n.t('content'));
        return(
            /* jshint ignore:start */
            <div id="sidebar-wrapper">
                <ul className="sidebar-nav">
                    <li className="sidebar-brand">
                        <h1>CONTENIDO</h1>
                    </li>
                    {this.props.navItemsIds.map(page => {
                        let level = this.props.navItemsById[page].level;
                        let marginPage = level*10 + 10 + "px";
                        if(level == 1) {
                            if (page.indexOf("se") != -1){
                                return (<VisorNavSection display={true}
                                                         key={page}
                                                         pageName={page}
                                                         navItemsById={this.props.navItemsById}
                                                         navItemSelected={this.props.navItemSelected}
                                                         changePage={(page)=> {this.props.changePage(page)}} />);
                            } else {
                                return (<li key={page}
                                            onClick={(e)=>{this.props.changePage(page)}}
                                            className="visorNavListEl">
                                            <a style={{paddingLeft: marginPage}}
                                                className={this.props.navItemSelected == page ? "selectedNavItemVisor":""}
                                                href="#">{this.props.navItemsById[page].name}</a>
                                </li>);
                            }
                        }
                    })}

                </ul>
            </div>
            /* jshint ignore:end */
        );
    }
}
