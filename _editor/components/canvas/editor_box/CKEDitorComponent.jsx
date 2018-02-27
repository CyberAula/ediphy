import React, { Component } from 'react';
import i18n from 'i18next';
import PropTypes from 'prop-types';
import { scrollElement, findBox } from '../../../../common/common_tools';

export default class CKEDitorComponent extends Component {
    constructor(props) {
        super(props);
        this.onBlur = this.onBlur.bind(this);

    }

    onBlur() {
        if (CKEDITOR.instances[this.props.id]) {
            CKEDITOR.instances[this.props.id].focusManager.blur(true);
            let data = CKEDITOR.instances[this.props.id].getData();
            if (data.length === 0) {
                data = i18n.t("text_here");
                CKEDITOR.instances[this.props.id].setData(data);
            }
            this.props.onBlur(data);
            let airlayer = document.getElementById("airlayer");
            if (airlayer) {
                airlayer.focus();
            } else {
                document.body.focus();
            }

        }
    }

    render() {
        return (
            <div id={this.props.id}
                ref={"textarea"}
                className={this.props.className}
                contentEditable
                style={this.props.style} />
        );
    }

    componentDidMount() {
        let toolbar = this.props.toolbars[this.props.id];
        if (toolbar.config && toolbar.config.needsTextEdition) {
            CKEDITOR.disableAutoInline = true;
            for (let key in toolbar.config.extraTextConfig) {
                CKEDITOR.config[key] += toolbar.config.extraTextConfig[key] + ",";
            }
            // TODO Scale text
            let editor = CKEDITOR.inline(this.refs.textarea /* , {
                fontSize_sizes: '1/1vh;2/2vh;3/3vh;4/4vh;5/5vh;6/6vh;'
            }*/);
            if (toolbar.state.__text) {
                editor.setData(decodeURI(toolbar.state.__text));

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
                let range = myEditor.createRange();
                range.moveToElementEditEnd(range.root);
                myEditor.getSelection().selectRanges([range]);
            // $.event.trigger({ type : 'keypress' });
            }

            /* TODO Scale text
            // buildPreview() is called every time "size" dropdowm is opened
            CKEDITOR.style.prototype.buildPreviewOriginal = CKEDITOR.style.prototype.buildPreview;
            CKEDITOR.style.prototype.buildPreview = function (label) {
            var result = this.buildPreviewOriginal (label);
            var match = /^(.*)font-size:(\d+)vh(.*)$/.exec (result);
            if (match) {
                // apparently ckeditor uses iframe or something that breaks vh units
                // we shall use current window height to convert vh to px here
                var pixels = Math.round (0.01 * window.innerHeight * parseInt (match[2]));
                result = match[1] + 'font-size:' + pixels + 'px' + match[3];
            }
            return result;
        };
        */
        }
        window.MathJax.Hub.Queue(["Typeset", window.MathJax.Hub]);

        if(prevProps.box.parent !== this.props.box.parent || prevProps.box.container !== this.props.box.container) {
            for (let instance in CKEDITOR.instances) {
                CKEDITOR.instances[instance].destroy();
            }
            CKEDITOR.inlineAll();
            for (let editor in CKEDITOR.instances) {
                console.log(editor, this.props.id);
                if (this.props.toolbars[editor].state.__text) {
                    CKEDITOR.instances[editor].setData(decodeURI(this.props.toolbars[editor].state.__text));
                }
            }
        }
    }
    componentWillReceiveProps(nextProps) {
        if (this.props.boxSelected === this.props.id && nextProps.boxSelected !== nextProps.id) {
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
                }
                /* let textArea = document.getElementById(nextProps.id);
                if (textArea) {textArea.focus();}*/

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
