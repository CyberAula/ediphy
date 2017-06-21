import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import i18n from 'i18next';
import VisorNavSection from './VisorNavSection';

export default class SideNavVisor extends Component {
    constructor(props) {
        super(props);
    }

    render() {

        let content = "CONTENIDO";
        return(
            /* jshint ignore:start */
            <div id="sidebar-wrapper">
                <ul className="sidebar-nav">
                    <li className="sidebar-brand">
                        <h1>{content}</h1>
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
