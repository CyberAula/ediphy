import React, {Component} from 'react';
import {Breadcrumb, BreadcrumbItem, Button} from 'react-bootstrap';

export default class DaliTitleVisor extends Component {
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
    render(){

        let content;
        let unidad = "";
        let currentStatus = this.props.titleMode;
        //let actualIndex = this.getActualIndex();

        if (currentStatus === 'reduced') {
            let titles = this.props.titles;

            let actualTitle = titles[titles.length - 1];
            unidad = titles[0];
            content = React.createElement("div", {className:"subheader"},
                React.createElement("h3", {style: {marginTop: '0px'}},
                    React.createElement(Breadcrumb, {style: {margin: 0, backgroundColor: 'inherit'}},
                        titles.map((item, index) => {
                            if (index !== 0 && index !== titles.length - 1) {
                                return React.createElement(BreadcrumbItem, {key: index}, /*this.getActualIndex(titles.length, index) + */item);
                            }
                        })
                    )
                ),
                React.createElement("h4", {}, /*this.getActualIndex() + */actualTitle)
            );

        } else if (currentStatus === 'expanded') {
            let titlesComponents = "";
            let titles_length = this.props.titles.length;
            content = React.createElement("div", {className:"subheader"},
                this.props.titles.map((text, index) => {
                    if (index === 0) {
                        unidad = text;
                    } else {
                        let nivel = (index > 4 ) ? 6 : index + 2;
                        return React.createElement("h" + nivel, {
                            key: index,
                            style: {marginTop: '0px'}
                        }, /*this.getActualIndex(titles_length, index) + */text);
                    }
                })
            );
        }

        return(
        /* jshint ignore:start */
        <div className="contenido"
            style={{backgroundColor: 'transparent',  display: currentStatus=='hidden'? 'none':'block'}}>
            {content}
        </div>
        /* jshint ignore:end */
        );

    }
}
