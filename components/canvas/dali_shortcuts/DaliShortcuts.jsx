import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {Button, Tooltip, OverlayTrigger} from 'react-bootstrap';
import i18n from 'i18next';
import {isSortableBox, isSortableContainer} from './../../../utils';


export default class DaliShortcuts extends Component {
    constructor(props) {
        super(props);
        this.state = {
            left: 0,
            top: 0,
            width: 0
        };
    }

    render() {
        let box = this.props.box;
        let toolbar = this.props.toolbar;

        if (!box && !toolbar) {
            return null;
        }

        return (
            /* jshint ignore:start */
            <div id={this.props.isContained ? "contained_daliBoxIcons" : "daliBoxIcons"}
                 className=""
                 ref="container"
                 style={{
                    display: isSortableBox(box.id) ? 'none' : 'block',
                    position: 'absolute',
                    left: this.state.left ,
                    top: this.state.top
                    //width: this.state.width !== 0 ? this.state.width : "auto"
                 }}>
                <div ref="innerContainer" style={{display: "inline-block", minWidth: "150px" }}>
                    <span className="namePlugin">{toolbar.config.displayName || ""}</span>

                    {
                        isSortableContainer(box.container) ? (
                            <OverlayTrigger placement="top"
                                            overlay={
                                            <Tooltip id="ajustaradocumento">
                                                {i18n.t('messages.adjust_to_document')}
                                            </Tooltip>
                                        }>
                                <button className="daliTitleButton"
                                        onClick={(e) => {
                                            let widthButton = Object.assign({}, toolbar.controls.main.accordions.__sortable.buttons.__width);
                                            if(widthButton.displayValue === 100 && widthButton.units === "%"){
                                                if(toolbar.config.needsTextEdition){
                                                    widthButton.displayValue = "auto";
                                                    widthButton.type = "text";
                                                }else{
                                                    widthButton.value = 20;
                                                    widthButton.displayValue = 20;
                                                    widthButton.type = "number";
                                                    widthButton.units = "%";
                                                }
                                            }else{
                                                widthButton.value = 100;
                                                widthButton.displayValue = 100;
                                                widthButton.type = "number";
                                                widthButton.units = "%";
                                            }

                                        this.props.onBoxResized(toolbar.id, widthButton);
                                        e.stopPropagation();
                                    }}>
                                    <i className="material-icons">code</i>
                                </button>
                            </OverlayTrigger>
                        ) : (
                            <span></span>
                        )
                    }
                    {
                        (toolbar && toolbar.config && toolbar.config.needsTextEdition) ? (
                            <OverlayTrigger placement="top"
                                            overlay={
                                            <Tooltip id="editartexto">
                                                {i18n.t('messages.edit_text')}
                                            </Tooltip>
                                        }>
                                <button className="daliTitleButton"
                                        onClick={(e) => {
                                        this.props.onTextEditorToggled(toolbar.id, !toolbar.showTextEditor);
                                        e.stopPropagation();
                                    }}>
                                    <i className="material-icons">mode_edit</i>
                                </button>
                            </OverlayTrigger>
                        ) : (
                            <span></span>
                        )
                    }
                    <OverlayTrigger placement="top"
                                    overlay={
                                        <Tooltip id="borrarcaja">
                                            {i18n.t('messages.erase_plugin')}
                                        </Tooltip>
                                    }>
                        <button className="daliTitleButton"
                                onClick={(e) => {
                                    this.props.onBoxDeleted(box.id, box.parent, box.container);
                                    e.stopPropagation();
                                }}>
                            <i className="material-icons">delete</i>
                        </button>
                    </OverlayTrigger>
                </div>
            </div>
            /* jshint ignore:end */
        );
    }


    componentDidUpdate(nextProps) {
      if (nextProps !== this.props){
        if (nextProps.box) {
            let box = document.getElementById('box-' + this.props.box.id);
            let element = ReactDOM.findDOMNode(this.refs.innerContainer);
            let left = 0;
            let top = 0;
            let width = 0;
            if (box) {
                var boxRect = box.getBoundingClientRect();
                var canvas = this.props.containedViewSelected === 0 ?
                    document.getElementById('canvas') :
                    document.getElementById('contained_maincontent');
                var canvasRect = canvas.getBoundingClientRect();

                left = (boxRect.left - canvasRect.left);
                top = (boxRect.top - canvasRect.top + canvas.scrollTop);

                if (element) {
                    var elementRect = element.getBoundingClientRect();
                    width = boxRect.width < elementRect.width ? elementRect.width : boxRect.width;
                } else {
                    width = box.getBoundingClientRect().width;
                }

            }
            this.setState({left: left, top: top, width: width});

        }
      }
    }

}
