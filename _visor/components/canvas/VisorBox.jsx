import React, { Component } from 'react';
import PropTypes from 'prop-types';
import PluginPlaceholderVisor from './VisorPluginPlaceholder';
import { isSortableBox, isAncestorOrSibling } from '../../../common/utils';

export default class VisorBox extends Component {
    constructor(props) {
        super(props);
        this.borderSize = 2;
    }
    componentDidUpdate(prevProps, prevState) {
        if(this.props.toolbars[this.props.id].config.needsTextEdition) {
            window.MathJax.Hub.Queue(["Typeset", window.MathJax.Hub]);
        }
    }
    render() {
        let cornerSize = 15;
        let box = this.props.boxes[this.props.id];
        let toolbar = this.props.toolbars[this.props.id];
        let vis = this.props.boxSelected === this.props.id;
        let style = {};

        let attrs = {};
        let width;
        let height;
        let classNames = "";

        if (toolbar.config.needsTextEdition) {
            style.textAlign = "left";
        }

        for (let tabKey in toolbar.controls) {
            for (let accordionKey in toolbar.controls[tabKey].accordions) {
                let button;
                for (let buttonKey in toolbar.controls[tabKey].accordions[accordionKey].buttons) {
                    button = toolbar.controls[tabKey].accordions[accordionKey].buttons[buttonKey];
                    if (!button.isAttribute) {
                        if (button.autoManaged) {
                            if (buttonKey === 'className' && button.value) {
                                classNames += button.value;
                            } else if (buttonKey === '__width') {
                                width = button.displayValue + (button.type === "number" ? button.units : "");
                            } else if (buttonKey === '__height') {
                                height = button.displayValue + (button.type === "number" ? button.units : "");
                            } else {
                                style[buttonKey] = button.value;
                            }
                        }
                    } else {
                        attrs['data-' + buttonKey] = button.value;
                    }

                }
                if (toolbar.controls[tabKey].accordions[accordionKey].accordions) {
                    for (let accordionKey2 in toolbar.controls[tabKey].accordions[accordionKey].accordions) {
                        for (let buttonKey in toolbar.controls[tabKey].accordions[accordionKey].accordions[accordionKey2].buttons) {
                            button = toolbar.controls[tabKey].accordions[accordionKey].accordions[accordionKey2].buttons[buttonKey];
                            if (!button.isAttribute) {
                                if (button.autoManaged) {
                                    if (buttonKey === 'className' && button.value) {
                                        classNames += button.value;
                                    } else {
                                        style[buttonKey] = button.value;
                                    }
                                }
                            } else {
                                attrs['data-' + buttonKey] = button.value;
                            }

                        }
                    }
                }
            }
        }

        // pass currentState  of component if exists
        if(this.props.richElementsState && this.props.richElementsState[box.id] !== undefined) {
            if(toolbar.config.flavor === "react") {
                toolbar.state.currentState = this.props.richElementsState[box.id];
            } else {
                toolbar.state.currentState = this.props.richElementsState[box.id];
            }
        }

        let rotate = 'rotate(0deg)';
        if (toolbar.controls.main.accordions.__sortable.buttons.__rotate && toolbar.controls.main.accordions.__sortable.buttons.__rotate.value) {
            rotate = 'rotate(' + toolbar.controls.main.accordions.__sortable.buttons.__rotate.value + 'deg)';
        }
        // style.transform = style.WebkitTransform = style.MsTransform = rotate;

        /* TODO: Reasign object if is rich to have marks as property box.content.props*/

        let content = toolbar.config.flavor === "react" ? (
            <div style={style} {...attrs} className={"boxStyle " + classNames} ref={"content"}>{Ediphy.Visor.Plugins[toolbar.config.name].getRenderTemplate(toolbar.state, box.id)}</div>
        ) : (
            <div style={style} {...attrs} className={"boxStyle " + classNames} ref={"content"}>
                {this.renderChildren(Ediphy.Visor.Plugins.get(toolbar.config.name).export(toolbar.state, toolbar.config.name, box.children.length !== 0, this.props.id), 0)}
            </div>
        );
        let border = (
            <div style={{ visibility: (vis ? 'visible' : 'hidden') }}>
                <div style={{
                    position: 'absolute',
                    top: -(this.borderSize),
                    left: -(this.borderSize),
                    width: '100%',
                    height: '100%',
                    boxSizing: 'content-box',
                }} />
            </div>
        );

        let classes = "wholeboxvisor";
        if (box.container) {
            classes += " dnd" + box.container;
        }

        if (box.height === 'auto') {
            classes += " automaticallySizedBox";
        }

        let verticalAlign = "top";
        if (isSortableBox(box.container)) {
            if (toolbar.controls.main.accordions.__sortable.buttons.__verticalAlign.value) {
                verticalAlign = toolbar.controls.main.accordions.__sortable.buttons.__verticalAlign.value;
            } else {
                verticalAlign = 'top';
            }
        }

        let wholeBoxVisorStyle = {
            position: box.position.type,
            left: box.position.x ? box.position.x : "",
            top: box.position.y ? box.position.y : "",
            width: width,
            height: height,
            verticalAlign: verticalAlign,
        };
        wholeBoxVisorStyle.transform = wholeBoxVisorStyle.WebkitTransform = wholeBoxVisorStyle.MsTransform = rotate;

        return (
            <div className={classes} id={'box-' + this.props.id}
                style={wholeBoxVisorStyle}>
                {border}
                {content}

            </div>
        );
    }

    __getMarkKeys(marks) {
        let markKeys = {};
        Object.keys(marks).map((mark) =>{
            let inner_mark = marks[mark];
            let value = inner_mark.value.toString();
            markKeys[value] = inner_mark.connection;
        });
        return markKeys;
    }

    renderChildren(markup, key) {
        let component;
        let props = {};
        let children = null;
        switch (markup.node) {
        case 'element':
            if (markup.attr) {
                props = markup.attr;
            }
            props.key = key;
            if (markup.tag === 'plugin') {
                component = PluginPlaceholderVisor;
                let resizable = markup.attr.hasOwnProperty("plugin-data-resizable");
                props = Object.assign({}, props, {
                    pluginContainer: markup.attr["plugin-data-id"],
                    resizable: resizable,
                    parentBox: this.props.boxes[this.props.id],
                    boxes: this.props.boxes,
                    toolbars: this.props.toolbars,
                    richElementsState: this.props.richElementsState,
                    changeCurrentView: this.props.changeCurrentView,
                    currentViewSelected: this.props.currentViewSelected,
                });
            } else {
                component = markup.tag;
            }
            break;
        case 'text':
            component = "span";
            props = { key: key };
            children = [decodeURI(markup.text)];
            break;
        case 'root':
            component = "div";
            props = { style: { width: '100%', height: '100%' } };
            break;
        }

        Object.keys(props).forEach(prop => {
            if (prop.startsWith("on")) {
                let value = props[prop];
                if (typeof value === "string") {
                    // eslint-disable-next-line
                    props[prop] = new Function(value);
                }
            }
        });

        if (markup.child) {
            if (markup.child.length === 1 && markup.child[0].node === "text") {
                props.dangerouslySetInnerHTML = {
                    __html: decodeURI(markup.child[0].text),
                };
            } else {
                children = [];
                markup.child.forEach((child, index) => {
                    children.push(this.renderChildren(child, index));
                });
            }
        }
        return React.createElement(component, props, children);
    }
}

VisorBox.propTypes = {
    /**
     * Identificador de la caja
     */
    id: PropTypes.string.isRequired,
    /**
     * Diccionario que contiene todas las cajas
     */
    boxes: PropTypes.object.isRequired,
    /**
     * Cambia la vista actual
     */
    changeCurrentView: PropTypes.func.isRequired,
    /**
     * Vista actual
     */
    currentView: PropTypes.any,
    /**
     * Diccionario que contiene todas las toolbars
     */
    toolbars: PropTypes.object,
    /**
     * Estado del plugin enriquecido en la transición
     */
    richElementsState: PropTypes.object,
};
