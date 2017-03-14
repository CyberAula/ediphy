import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import PluginPlaceholderVisor from './PluginPlaceholderVisor';
import {isBox, isSortableBox, isView, isSortableContainer, isAncestorOrSibling} from './../../../utils';

export default class BoxVisor extends Component {
    constructor(props) {
        super(props);
        this.borderSize = 2;
    }

    render() {
        let cornerSize = 15;
        let box = this.props.boxes[this.props.id];
        let toolbar = this.props.toolbars[this.props.id];
        let vis = this.props.boxSelected === this.props.id;
        let style = {};

        let textareaStyle = {
            position: 'absolute',
            resize: 'none',
            top: '0%',
            color: 'black',
            backgroundColor: 'white',
            padding: 0,
            width: '100%',
            height: (toolbar.showTextEditor ? '' : '100%'),
            border: 'dashed black 1px',
            zIndex: 99999,
            visibility: (toolbar.showTextEditor ? 'visible' : 'hidden')
        };
        let attrs = {};
        let width;
        let height;
        let classNames = "";

        if (toolbar.config.needsTextEdition) {
            textareaStyle.textAlign = "left";
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
                    if (buttonKey === 'fontSize') {
                        textareaStyle.fontSize = button.value;
                        if (button.units) {
                            textareaStyle.fontSize += button.units;
                        }
                    } else if (buttonKey === 'color') {
                        textareaStyle.color = button.value;
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
                            if (buttonKey === 'fontSize') {
                                textareaStyle.fontSize = button.value;
                                if (button.units) {
                                    textareaStyle.fontSize += button.units;
                                }
                            } else if (buttonKey === 'color') {
                                textareaStyle.color = button.value;
                            }
                        }
                    }
                }
            }
        }

        let content = toolbar.config.flavor === "react" ? (
            /* jshint ignore:start */
            <div style={style} {...attrs} className={"boxStyle " + classNames} ref={"content"}>
                {Dali.Visor.Plugins[toolbar.config.name].getRenderTemplate(box.content.props.state)}
            </div>
            /* jshint ignore:end */
        ) : (
            /* jshint ignore:start */
            <div style={style} {...attrs} className={"boxStyle " + classNames} ref={"content"}>
                {this.renderChildren(box.content)}
            </div>
            /* jshint ignore:end */
        );
        let border = (
                /* jshint ignore:start */
                <div style={{visibility: (vis ? 'visible' : 'hidden')}}>
                    <div style={{
                    position: 'absolute',
                    top: -(this.borderSize),
                    left: -(this.borderSize),
                    width: '100%',
                    height: '100%',
                    boxSizing: 'content-box'
                }}>
                    </div>
                </div>
                /* jshint ignore:end */
            );


        let classes = "wholebox";
        if (box.container) {
            classes += " dnd" + box.container;
        }

        if (box.height === 'auto') {
            classes += " automaticallySizedBox";
        }

        let showOverlay = "none";
        // If current level selected is bigger than this box's and it has no children, show overlay
        if (this.props.boxLevelSelected > box.level && box.children.length === 0) {
            showOverlay = "initial";
        // If current level selected is the same but this box belongs to another "tree" of boxes, show overlay
        } else if (this.props.boxLevelSelected === box.level &&
                   box.level !== 0 &&
                   !isAncestorOrSibling(this.props.boxSelected, this.props.id, this.props.boxes)) {
            showOverlay = "initial";
        }
        let verticalAlign = "top";
        if (isSortableBox(box.container)) {
            if (toolbar.controls.main.accordions.__sortable.buttons.__verticalAlign.value) {
                verticalAlign = toolbar.controls.main.accordions.__sortable.buttons.__verticalAlign.value;
            } else {
                verticalAlign = 'top';
            }
        }
        return (
            /* jshint ignore:start */
            <div className={classes} id={'box-' + this.props.id}
                 style={{
                    position: box.position.type,
                    left: box.position.x ? box.position.x : "",
                    top: box.position.y ? box.position.y : "",
                    width: width,
                    height: height,
                    verticalAlign: verticalAlign
                }}>
                {border}
                {content}
                {toolbar.state.__text ?
                    <div id={box.id}
                         ref={"textarea"}
                         className={classNames + " textAreaStyle"}
                         contentEditable={true}
                         style={textareaStyle}></div> :
                    null
                }
            </div>
            /* jshint ignore:end */
        );
    }

    renderChildren(markup, key) {
        let component;

        let children = null;

        children = [];
        markup.child.forEach((child, index) => {
            children.push(this.renderChildren(child, index));
        });
            
        
        return React.createElement(component, children);
    }
}