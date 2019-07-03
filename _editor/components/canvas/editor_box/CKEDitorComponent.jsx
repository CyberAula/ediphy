import React, { Component } from 'react';
import i18n from 'i18next';
import PropTypes from 'prop-types';
import { scrollElement, findBox, blurCKEditor, fontString } from '../../../../common/common_tools';

export default class CKEDitorComponent extends Component {

    onBlur = () => {
        blurCKEditor(this.props.id, this.props.onBlur);
    };

    render() {
        return (
            <div
                id={this.props.id}
                ref={"textarea"}
                className={this.props.className}
                contentEditable = "true"
                style={this.props.style} />
        );
    }

    componentDidMount() {
        let toolbar = this.props.toolbars[this.props.id];
        let config = Ediphy.Plugins.get(toolbar.pluginId).getConfig();
        if (config && config.needsTextEdition) {
            CKEDITOR.disableAutoInline = true;
            // CKEDITOR.addCss('p span{font-size: 1vw} p{font-size: 1vw}');
            /* for (let key in config.extraTextConfig) {
                CKEDITOR.config[key] += toolbar.config.extraTextConfig[key] + ",";
            }*/
            let editor = CKEDITOR.inline(this.refs.textarea);

            /* editor.document.$.body.disabled = true;
            editor.document.$.body.contentEditable = false;
            editor.document.$.designMode="off";*/

            editor.config.fontSize_sizes = fontString();
            editor.config.font_defaultLabel = 'Arial';
            editor.config.fontSize_defaultLabel = '14';
            // editor.config.fontSize_style = {
            //     element:        'span',
            //     styles:         { 'font-size': '#(size)' },
            //     overrides:      [ { element: 'font', attributes: { 'size': null } } ]
            // };
            if (toolbar.state.__text) {
                editor.setData(decodeURI(toolbar.state.__text));

            }

            editor.focus();

            // SAFARI FIX: Problema con CKEditor y Safari al intentar crear un editor inline sobre un div con display: none. Solución propuesta en: https://dev.ckeditor.com/ticket/9814
            let isSafari = (/constructor/i).test(window.HTMLElement) || (function(p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window.safari || (typeof safari !== 'undefined' && safari.pushNotification));
            if (isSafari) {
                editor.on('focus', () => {
                    editor.setReadOnly(false);
                });
            }
        }
    }

    componentWillUnmount() {

        if (CKEDITOR.instances[this.props.id]) {
            if (CKEDITOR.instances[this.props.id].focusManager.hasFocus) {
                this.onBlur();
            }
            CKEDITOR.instances[this.props.id].destroy();
        }

    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.toolbars[this.props.id].showTextEditor && prevProps.toolbars[prevProps.id] && !prevProps.toolbars[prevProps.id].showTextEditor) {
            this.refs.textarea.focus();
            // Focus cursor at end of content
            // https://recalll.co/ask/v/topic/fckeditor-How-to-set-cursor-position-to-end-of-text-in-CKEditor/5541ec6304ce0209458b9107#59f908ff1126f4577eec64ec

            let myEditor = CKEDITOR.instances[this.props.id];
            // Obtain the current selection & range

            if (myEditor) {
                myEditor.setData(decodeURI(this.props.toolbars[this.props.id].state.__text));
                let range = myEditor.createRange();
                if (range && range.root) {
                    range.moveToElementEditEnd(range.root);
                    myEditor.getSelection().selectRanges([range]);
                }
            // $.event.trigger({ type : 'keypress' });
            }
            this.refs.textarea.focus();
        }
        if (window.MathJax) {
            window.MathJax.Hub.Queue(["Typeset", window.MathJax.Hub]);
        }

        if(prevProps.box.parent !== this.props.box.parent || prevProps.box.container !== this.props.box.container) {
            for (let instance in CKEDITOR.instances) {
                CKEDITOR.instances[instance].destroy();
            }
            CKEDITOR.inlineAll();
            for (let editor in CKEDITOR.instances) {
                if (this.props.toolbars[editor].state.__text) {
                    CKEDITOR.instances[editor].setData(decodeURI(this.props.toolbars[editor].state.__text));
                }
            }
        }
    }
    componentWillReceiveProps(nextProps) {
        if (this.props.boxSelected === this.props.id && nextProps.boxSelected !== nextProps.id && this.props.toolbars[this.props.id].showTextEditor) {
            this.onBlur();
        }
        if (nextProps.boxSelected === nextProps.id) {
            if (this.props.toolbars[this.props.id].showTextEditor === true && nextProps.toolbars[nextProps.id].showTextEditor === false) {
                // this.onBlur();
            } else if (this.props.toolbars[this.props.id].showTextEditor === false && nextProps.toolbars[nextProps.id].showTextEditor === true) {
                let CKstring = CKEDITOR.instances[nextProps.id].getData();
                let initString = "<p>" + i18n.t("text_here") + "</p>\n";
                if(CKstring === initString) {
                    CKEDITOR.instances[nextProps.id].setData("");
                } else {
                    CKEDITOR.instances[nextProps.id].setData(decodeURI(nextProps.toolbars[nextProps.id].state.__text));
                }

            }
        }
    }

}
CKEDitorComponent.propTypes = {
    /**
   * Selected box
   */
    boxSelected: PropTypes.any,
    /**
   * Box to which the CKEDitor belongs
   */
    box: PropTypes.any,
    /**
   * Style object
   */
    style: PropTypes.object,
    /**
   * CSS classes to apply
   */
    className: PropTypes.string,
    /**
   * Toolbars
   */
    toolbars: PropTypes.object,
    /**
   * Box id
   */
    id: PropTypes.any,
    /**
   * Blur callback
   */
    onBlur: PropTypes.func.isRequired,
};
