import React, { Component } from 'react';
import i18n from 'i18next';
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
            let editor = CKEDITOR.inline(this.refs.textarea);
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
        }
        window.MathJax.Hub.Queue(["Typeset", window.MathJax.Hub]);

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
