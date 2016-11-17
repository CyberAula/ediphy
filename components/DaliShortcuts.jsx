import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {Button, Tooltip, OverlayTrigger} from 'react-bootstrap';
import {ID_PREFIX_BOX, ID_PREFIX_PAGE, ID_PREFIX_SECTION, ID_PREFIX_SORTABLE_BOX, ID_PREFIX_SORTABLE_CONTAINER} from '../constants';
import i18n from 'i18next';

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
        if (!box) {
            return null;
        }
        let toolbar = this.props.toolbar;
        return (
            /* jshint ignore:start */
            <div id={this.props.isContained ? "contained_daliBoxIcons" : "daliBoxIcons"}
                 className=""
                 ref="container"
                 style={{
                    display: (box.id.indexOf(ID_PREFIX_SORTABLE_BOX) === -1) ? 'block' : 'none',
                    position: 'absolute',
                    left: this.state.left,
                    top: this.state.top,
                    width: this.state.width !== 0 ? this.state.width : "auto"
                 }}>
                <div ref="innerContainer" style={{display: "inline-block"}}>
                    {
                        (box.container.length && box.container.indexOf(ID_PREFIX_SORTABLE_CONTAINER) !== -1) ? (
                            <OverlayTrigger placement="top"
                                            overlay={
                                            <Tooltip id="ajustaradocumento">
                                                {i18n.t('messages.adjust_to_document')}
                                            </Tooltip>
                                        }>
                                <button className="daliTitleButton"
                                        onClick={(e) => {
                                        let newWidth = (box.width == '100%') ? (toolbar.config.category !== 'text' ? '20%' : ''): '100%';
                                        this.props.onBoxResized(toolbar.id, newWidth, 'auto');
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
                                    this.props.onBoxDeleted(this.props.box.id, this.props.box.parent, this.props.box.container);
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

    componentWillReceiveProps(nextProps) {
        if (nextProps.box) {
            let box = document.getElementById('box-' + nextProps.box.id);
            let element = ReactDOM.findDOMNode(this.refs.innerContainer);
            let left = 0;
            let top = 0;
            let width = 0;
            if (box) {
                var boxRect = box.getBoundingClientRect();
                var canvas = this.props.containedViewSelected === 0 ?
                    document.getElementById('maincontent') :
                    document.getElementById('contained_maincontent');
                var canvasRect = canvas.getBoundingClientRect();

                left = (boxRect.left - canvasRect.left);
                top = (boxRect.top - canvasRect.top + canvas.scrollTop);

                if (element) {
                    var elementRect = element.getBoundingClientRect();
                    width = boxRect.width < elementRect.width ? elementRect.width : boxRect.width;
                } else {
                    //width = boxRect.width;
                }
            }
            this.setState({left: left, top: top, width: width});
        }
    }
}