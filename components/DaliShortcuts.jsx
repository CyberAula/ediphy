import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {Input, Button, Tooltip, OverlayTrigger} from 'react-bootstrap';
import interact from 'interact.js';
import {BOX_TYPES, ID_PREFIX_BOX, ID_PREFIX_PAGE, ID_PREFIX_SECTION, ID_PREFIX_SORTABLE_BOX, ID_PREFIX_SORTABLE_CONTAINER} from '../constants';
import i18n from 'i18next';

export default class DaliShortcuts extends Component {
    constructor(props) {
        super(props);
        //recalculatePosition();

    }

    render() {
        let box = this.props.box;
        let toolbar = this.props.toolbar;
        if (box) {
            let style = pos(box.id);
            return (
                /* jshint ignore:start */
                <div id="daliBoxIcons" className=""
                     style={{display: (box != -1 && box.type != "sortable" ) ? 'block' : 'none' , 
                             position: 'absolute', left: style.left, top: style.top, width: style.width}}>
                    { (box.container != 0) ? (
                        <OverlayTrigger placement="top"
                                        overlay={ <Tooltip id="ajustaradocumento">{ i18n.t('messages.adjust_to_document') } </Tooltip>}>
                            <button className="daliTitleButton"
                                    onClick={(e) => {
                                let newWidth = (box.width == '100%') ? (toolbar.config.category !== 'text' ? '20%' : ''): '100%'
                                this.props.onBoxResized(toolbar.id, newWidth, 'auto');
                                e.stopPropagation(); }}>
                                <i className="material-icons">code</i>
                            </button>
                        </OverlayTrigger>
                    ) : (<span></span> )
                    }
                    { (toolbar && toolbar.config && toolbar.config.needsTextEdition) ? (
                        <OverlayTrigger placement="top" overlay={ <Tooltip id="editartexto" >{ i18n.t('messages.edit_text') }</Tooltip>}>
                            <button className="daliTitleButton"
                                    onClick={(e) => {
                                 this.props.onTextEditorToggled(toolbar.id, !toolbar.showTextEditor);
                                e.stopPropagation(); }}>
                                <i className="material-icons">mode_edit</i>
                            </button>
                        </OverlayTrigger>
                    ) : (<span></span> )
                    }
                    <OverlayTrigger placement="top" overlay={ <Tooltip id="borrarcaja" >{ i18n.t('messages.erase_plugin') }</Tooltip>}>
                        <button className="daliTitleButton"
                                onClick={(e) => {
                                this.props.onBoxDeleted(this.props.box.id, this.props.box.parent, this.props.box.container);
                                e.stopPropagation(); }}>
                            <i className="material-icons">delete</i>
                        </button>
                    </OverlayTrigger>
                </div>
                /* jshint ignore:end */
            );

        } else {
            return (
                /* jshint ignore:start */
                <br/>
                /* jshint ignore:end */
            );
        }
    }

 
    shouldComponentUpdate(nextProps, nextState) {
          return true;
    }
 
}


function pos(id){
    let element = document.getElementById('box-' + id);
    let bar = document.getElementById('daliBoxIcons');
    if (element && bar) {
        var rect = element.getBoundingClientRect();
        var main = document.getElementById('maincontent');
        var canvas = main.getBoundingClientRect();
        let style = {};
        style.left = (rect.left - canvas.left) + 'px';
        style.top = (rect.top - canvas.top + main.scrollTop) + 'px';
        style.width = element.clientWidth + 'px';
        return style;
    }
    return {left: 0, top: 0, width: 0 };

}