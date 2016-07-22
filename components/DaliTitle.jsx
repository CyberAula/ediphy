import React, {Component} from 'react';
import {Breadcrumb, BreadcrumbItem, Button} from 'react-bootstrap';

export default class DaliTitle extends Component {
    render() {
        let content;
        let unidad = "";
        let currentstatus = this.props.isReduced;
        let hideButton = (this.props.titles.length <= 1 && !this.props.isReduced || this.props.titles.length === 0 && currentstatus);

        if (currentstatus === 'reduced') {
            let titles = this.props.titles;
            let actualTitle = titles[titles.length - 1];
            unidad = titles[0];
            content = React.createElement("div", {},
                React.createElement("h3", {},
                    React.createElement(Breadcrumb, {style: {margin: 0, backgroundColor: 'inherit'}},
                        titles.map((item, index) => {
                            if (index !== 0 && index !== titles.length - 1) {
                                return React.createElement(BreadcrumbItem, {key: index}, item);
                            }
                        })
                    )
                ),
                React.createElement("h4", {style: {margin: 0}}, actualTitle)
            );

        } else if (currentstatus === 'expanded') {
            let titlesComponents = "";
            content = React.createElement("div", {},
                this.props.titles.map((text, index) => {
                    if (index === 0) {
                        unidad = text;
                    } else {
                        let nivel = (index > 4 ) ? 6 : index + 2;
                        return React.createElement("h" + nivel, {key: index, style: {marginTop: '16px'}}, text);
                    }
                })
            );
        }

        return (
            /* jshint ignore:start */
            <div className="title" onClick={(e) => {
                                    this.props.onBoxSelected(-1);
                                    this.props.onShowTitle();
                                    e.stopPropagation(); }}>
                <div id="daliTitleButtons" style={{height:'40px'}}>

                    <button className={((!this.props.showButtons || currentstatus == 'hidden' )? 'daliTitleButton hidden ' : ' daliTitleButton ')  
                                     + ((currentstatus == 'expanded') ? ' activeTitle' : ' ')}
                            onClick={(e) => {
                                this.props.titleModeToggled(this.props.navItemId, 'expanded' );
                                e.stopPropagation(); }}>
                        <i className="material-icons">vertical_align_bottom</i>
                    </button>
                    <button className={((!this.props.showButtons || currentstatus == 'hidden' )? ' daliTitleButton hidden ' : ' daliTitleButton ')  
                                     + ((currentstatus == 'reduced') ? ' activeTitle ' : ' ')}
                            onClick={(e) => {
                                this.props.titleModeToggled(this.props.navItemId, 'reduced');
                                e.stopPropagation();}}>
                        <i className="material-icons">keyboard_tab</i>
                    </button>
                    <button
                        className={((!this.props.showButtons || currentstatus == 'hidden' )? 'daliTitleButton hidden activeTitle' : 'daliTitleButton ')}
                        onClick={(e) => {
                                this.props.titleModeToggled(this.props.navItemId, 'hidden');
                                e.stopPropagation();}}>
                        <i className="material-icons">visibility_off</i>
                    </button>
                    <button className={currentstatus == 'hidden' ? 'daliTitleButton  ' : 'daliTitleButton hidden'}
                            onClick={(e) => {
                                this.props.titleModeToggled(this.props.navItemId, 'reduced');
                                this.props.onShowTitle();
                                e.stopPropagation();}}>
                        <i className="material-icons">visibility</i>
                    </button>


                </div>
                <div className={this.props.showButtons ?  "caja selectedTitle selectedBox":"caja"}>
                    <div className="cab"
                         style={{backgroundColor: 'transparent',  visibility: currentstatus=='hidden'? 'hidden':'inherit'}}>
                        <div className="cabtabla_numero">1</div>
                        <div className="tit_ud_cap">
                            <h1>{this.props.courseTitle}</h1>
                            <h2>{unidad}</h2>
                        </div>
                        <div className="cabtabla_lapiz">

                            <img style={{display: 'none', visibility: currentstatus=='hidden'? 'hidden':'inherit'}}
                                 src="images/ico_alumno.gif" alt="Alumno"/>
                            <div style={{display: 'none'}} id="alumno2"> Alumno</div>
                        </div>
                        <div style={{display: 'none'}} className="clear"></div>
                    </div>
                    <div className="contenido"
                         style={{backgroundColor: 'transparent',  display: currentstatus=='hidden'? 'none':'block'}}>
                        {content}
                    </div>
                </div>
                <br style={{clear:'both',  visibility: currentstatus=='hidden'? 'hidden':'inherit'}}/>
            </div>
            /* jshint ignore:end */
        );
    }

}
