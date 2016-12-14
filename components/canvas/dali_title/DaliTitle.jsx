import React, {Component} from 'react';
import {Breadcrumb, BreadcrumbItem, Button} from 'react-bootstrap';

require('./_daliTitle.scss');

export default class DaliTitle extends Component {

    /*
     * This method is used to calculate actual position for title indexes
     * It is used the array of titles, the actual position in the iteration, and the level stored in nav properties
     */
    getActualIndex(size = 1, level = 0) {
        // Default values are stored in this variables
        let actual_parent = this.props.navItems[this.props.navItem.parent];
        let actual_level = this.props.navItem;
        //Equal size to the index of level
        size = size - 1;


        if (size === undefined || level === undefined || this.props.titles.length === 0) {
            //This happens when you are in a root element

            return "";

        } else if (size === level) {
            //This happens when you are in the first level
            let actual_index = (actual_parent.children.indexOf(actual_level.id));
            if (actual_index !== -1) {
                return (actual_index + 1) + ". ";
            }
        } else {
            //This happens when you have several sections in the array
            //You iterate inversely in the array until you get to the level stored in nav properties
            let actual_index;
            let interating_level = level + 1;

            for (let n = actual_level.level; interating_level < n; n--) {
                actual_level = actual_parent;
                actual_parent = this.props.navItems[actual_level.parent];
            }

            let final_level = actual_parent.children.indexOf(actual_level.id) + 1;
            if (actual_parent !== undefined && actual_parent.children !== undefined) {
                return final_level + ". ";
            } else {
                return "";
            }
        }
    }

    render() {

        let content;
        let unidad = "";
        let currentStatus = this.props.titleMode;
        let actualIndex = this.getActualIndex();

        if (currentStatus === 'reduced') {
            let titles = this.props.titles;

            let actualTitle = titles[titles.length - 1];
            unidad = titles[0];
            content = React.createElement("div", {},
                React.createElement("h3", {},
                    React.createElement(Breadcrumb, {style: {margin: 0, backgroundColor: 'inherit'}},
                        titles.map((item, index) => {
                            //console.log(titles);
                            if (index !== 0 && index !== titles.length - 1) {
                                return React.createElement(BreadcrumbItem, {key: index}, /*this.getActualIndex(titles.length, index) + */item);
                            }
                        })
                    )
                ),
                React.createElement("h4", {style: {margin: 0}}, /*this.getActualIndex() + */actualTitle)
            );

        } else if (currentStatus === 'expanded') {
            let titlesComponents = "";
            let titles_length = this.props.titles.length;
            content = React.createElement("div", {},
                this.props.titles.map((text, index) => {
                    if (index === 0) {
                        unidad = text;
                    } else {
                        let nivel = (index > 4 ) ? 6 : index + 2;
                        return React.createElement("h" + nivel, {
                            key: index,
                            style: {marginTop: '16px'}
                        }, /*this.getActualIndex(titles_length, index) + */text);
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

                    <button className={((!this.props.showButtons || currentStatus == 'hidden' )? 'daliTitleButton hidden ' : ' daliTitleButton ')
                                     + ((currentStatus == 'expanded') ? ' activeTitle' : ' ')}
                            onClick={(e) => {
                                this.props.titleModeToggled(this.props.navItem.id, 'expanded' );
                                e.stopPropagation(); }}>
                        <i className="material-icons">vertical_align_bottom</i>
                    </button>
                    <button className={((!this.props.showButtons || currentStatus == 'hidden' )? ' daliTitleButton hidden ' : ' daliTitleButton ')
                                     + ((currentStatus == 'reduced') ? ' activeTitle ' : ' ')}
                            onClick={(e) => {
                                this.props.titleModeToggled(this.props.navItem.id, 'reduced');
                                e.stopPropagation();}}>
                        <i className="material-icons">keyboard_tab</i>
                    </button>
                    <button
                        className={((!this.props.showButtons || currentStatus == 'hidden' )? 'daliTitleButton hidden activeTitle' : 'daliTitleButton ')}
                        onClick={(e) => {
                                this.props.titleModeToggled(this.props.navItem.id, 'hidden');
                                e.stopPropagation();}}>
                        <i className="material-icons">visibility_off</i>
                    </button>
                    <button className={currentStatus == 'hidden' ? 'daliTitleButton  ' : 'daliTitleButton hidden'}
                            onClick={(e) => {
                                this.props.titleModeToggled(this.props.navItem.id, 'reduced');
                                this.props.onShowTitle();
                                e.stopPropagation();}}>
                        <i className="material-icons">visibility</i>
                    </button>


                </div>
                <div className={this.props.showButtons ?  "caja selectedTitle selectedBox":"caja"}>
                    <div className="cab"
                         style={{backgroundColor: 'transparent',  visibility: currentStatus=='hidden'? 'hidden':'inherit'}}>
                        <span className="cabtabla_numero"
                              contentEditable={this.props.navItem.parent === 0}
                              suppressContentEditableWarning
                              onBlur={e => {
                                this.props.onUnitNumberChanged(this.props.navItem.id, parseInt(e.target.innerText, 10));
                              }}
                        >{this.props.navItem.unitNumber}</span>
                        <div className="tit_ud_cap">
                            <h1>{this.props.courseTitle}</h1>
                            <h2>{unidad}</h2>
                        </div>
                        <div className="cabtabla_lapiz">

                            <img style={{display: 'none', visibility: currentStatus=='hidden'? 'hidden':'inherit'}}
                                 src="images/ico_alumno.gif" alt="Alumno"/>
                            <div style={{display: 'none'}} id="alumno2"> Alumno</div>
                        </div>
                        <div style={{display: 'none'}} className="clear"></div>
                    </div>
                    <div className="contenido"
                         style={{backgroundColor: 'transparent',  display: currentStatus=='hidden'? 'none':'block'}}>
                        {content}
                    </div>
                </div>
                <br style={{clear:'both',  visibility: currentStatus=='hidden'? 'hidden':'inherit'}}/>
            </div>
            /* jshint ignore:end */
        );
    }

}
