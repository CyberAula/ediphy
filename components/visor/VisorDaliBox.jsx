import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {Input,Button} from 'react-bootstrap';

import VisorPluginPlaceholder from '../visor/VisorPluginPlaceholder';
import {BOX_TYPES, ID_PREFIX_PAGE, ID_PREFIX_SECTION, ID_PREFIX_SORTABLE_BOX, ID_PREFIX_SORTABLE_CONTAINER} from '../../constants';

export default class VisorDaliBox extends Component{
    render(){
        let borderSize = 2;
        let cornerSize = 15;
        let box = this.props.boxes[this.props.id];
        let toolbar = this.props.toolbars[this.props.id];
        let vis = ((this.props.boxSelected === this.props.id) && box.type !== BOX_TYPES.SORTABLE);
        let style = {
            width: '100%',
            height: '100%',
            position: 'relative',
            wordWrap: 'break-word',
            visibility: (toolbar.showTextEditor ? 'hidden' : 'visible')
        };
        let attrs = {};
       
        if(toolbar.buttons) {
            toolbar.buttons.map((item, index) => {
                if(item.autoManaged) {
                    if(!item.isAttribute) {
                        if(item.name !== 'width' && item.name !== 'height') {
                            style[item.name] = item.value;
                            if(item.units) {
                                style[item.name] += item.units;
                            }
                        }
                    }else {
                        attrs['data-' + item.name] = item.value;
                    }
                }
            });
        }
        let content = (
            <div style={style} {...attrs}>
                {this.renderChildren(Dali.Visor.Plugins.get(toolbar.config.name).render(toolbar.state, toolbar.config.name), 0)}
            </div>
        );

        return (
            <div className="wholebox" 
                 style={{
                    position: 'absolute',
                    left: box.position.x,
                    top: box.position.y,
                    width: box.width ,
                    height: box.height,
                    maxWidth: '100%',
                    maxHeight: '100%',
                    cursor:  'default' //esto evita que aparezcan los cursores de move y resize cuando la caja no está seleccionada
                }}>
            {content}
        </div>);
    }

    renderChildren(markup, key){
        let component;
        let props = {};
        let children;
        switch (markup.node) {
            case 'element':
                if(markup.attr){
                    props = markup.attr;
                }
                props.key = key;
                if(markup.tag === 'plugin'){
                    component = VisorPluginPlaceholder;
                    props = Object.assign({}, props, {
                        pluginContainer: markup.attr["plugin-data-id"],
                        parentBox: this.props.boxes[this.props.id],
                        boxes: this.props.boxes,
                        toolbars: this.props.toolbars
                    });
                }else{
                    component = markup.tag;
                }
                break;
            case 'text':
                component = "span";
                props = {key: key};
                children = [markup.text];
                break;
            case 'root':
                component = "div";
                props = {style: {width: '100%', height: '100%'}}
                break;
        }

        if (markup.child) {
            children = [];
            markup.child.forEach((child, index) => {
                children.push(this.renderChildren(child, index))
            });
        }
        return React.createElement(component, props, children);
    }
}