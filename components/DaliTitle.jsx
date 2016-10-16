import React, {Component} from 'react';
import {Breadcrumb, BreadcrumbItem, Button} from 'react-bootstrap';

export default class DaliTitle extends Component {

    getActualIndex(size, level){
        
        let actual_parent = this.props.navItems[this.props.navItem.parent];
        let actual_level = this.props.navItem;
        size = size - 1;

        if (size === undefined || level === undefined){
            return "";
        } else if(size === level){

            let actual_index = (actual_parent.children.indexOf(actual_level.id));
            if (actual_index !== -1){
                return (actual_index + 1) + ". ";
            }

        } else {

            let actual_index;
            console.log("Level " + actual_level.level);

            console.log("size" + size);
            console.log("level" + level);

            for(let n = level; n > 1; n--){
                actual_level = actual_parent;
                actual_parent = this.props.navItems[actual_level.parent];
            }

            console.log("final_parent");
            console.log(actual_parent);
            console.log("final_level");
            console.log(actual_level);
            console.log("final_index");
            console.log(actual_parent.children.indexOf(actual_level.id) + 1);
                
            let final_level = actual_parent.children.indexOf(actual_level.id) + 1;
            if(actual_parent !== undefined && actual_parent.children !== undefined){
                return final_level;
            } else {
                return "";
            }
        }
    }

    render() {
        let content;
        let unidad = "";
        let currentstatus = this.props.isReduced;
        let hideButton = (this.props.titles.length <= 1 && !this.props.isReduced || this.props.titles.length === 0 && currentstatus);
        let actualIndex = this.getActualIndex();

        if (currentstatus === 'reduced') {
            let titles = this.props.titles;
            
            let actualTitle = titles[titles.length - 1];
            unidad = titles[0];
            content = React.createElement("div", {},
                React.createElement("h3", {},
                    React.createElement(Breadcrumb, {style: {margin: 0, backgroundColor: 'inherit'}},
                        titles.map((item, index) => {
                            //console.log(titles);
                            if (index !== 0 && index !== titles.length - 1) {
                                return React.createElement(BreadcrumbItem, {key: index}, this.getActualIndex(titles.length, index) + item);
                            }
                        })
                    )
                ),
                React.createElement("h4", {style: {margin: 0}}, actualIndex + actualTitle)
            );

        } else if (currentstatus === 'expanded') {
            let titlesComponents = "";
            let titles_length = this.props.titles.length;
            content = React.createElement("div", {},
                this.props.titles.map((text, index) => {
                    if (index === 0) {
                        unidad = text;
                    } else {
                        let nivel = (index > 4 ) ? 6 : index + 2;
                        return React.createElement("h" + nivel, {key: index, style: {marginTop: '16px'}}, this.getActualIndex(titles_length, index) + text);
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
                                this.props.titleModeToggled(this.props.navItem.id, 'expanded' );
                                e.stopPropagation(); }}>
                        <i className="material-icons">vertical_align_bottom</i>
                    </button>
                    <button className={((!this.props.showButtons || currentstatus == 'hidden' )? ' daliTitleButton hidden ' : ' daliTitleButton ')
                                     + ((currentstatus == 'reduced') ? ' activeTitle ' : ' ')}
                            onClick={(e) => {
                                this.props.titleModeToggled(this.props.navItem.id, 'reduced');
                                e.stopPropagation();}}>
                        <i className="material-icons">keyboard_tab</i>
                    </button>
                    <button
                        className={((!this.props.showButtons || currentstatus == 'hidden' )? 'daliTitleButton hidden activeTitle' : 'daliTitleButton ')}
                        onClick={(e) => {
                                this.props.titleModeToggled(this.props.navItem.id, 'hidden');
                                e.stopPropagation();}}>
                        <i className="material-icons">visibility_off</i>
                    </button>
                    <button className={currentstatus == 'hidden' ? 'daliTitleButton  ' : 'daliTitleButton hidden'}
                            onClick={(e) => {
                                this.props.titleModeToggled(this.props.navItem.id, 'reduced');
                                this.props.onShowTitle();
                                e.stopPropagation();}}>
                        <i className="material-icons">visibility</i>
                    </button>


                </div>
                <div className={this.props.showButtons ?  "caja selectedTitle selectedBox":"caja"}>
                    <div className="cab"
                         style={{backgroundColor: 'transparent',  visibility: currentstatus=='hidden'? 'hidden':'inherit'}}>
                        <span className="cabtabla_numero"
                              contentEditable={this.props.navItem.parent === 0}
                              suppressContentEditableWarning
                              onBlur={e => {
                                this.props.onUnitNumberChanged(this.props.navItem.id, e.target.innerText);
                              }}
                        >{this.props.navItem.unitNumber}</span>
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
