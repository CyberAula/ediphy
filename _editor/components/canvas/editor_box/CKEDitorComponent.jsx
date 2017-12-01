import React, { Component } from 'react';
import i18n from 'i18next';
export default class CKEDitorComponent extends Component {
    constructor(props) {
        super(props);
        // this.updateContent = this.updateContent.bind(this);
        this.onBlur = this.onBlur.bind(this);

    }

    onBlur() {
        CKEDITOR.instances[this.props.id].focusManager.blur(true);
        let data = CKEDITOR.instances[this.props.id].getData();
        if(data.length === 0) {
            data = i18n.t("text_here");
            CKEDITOR.instances[this.props.id].setData(data);
        }
        this.props.onBlur(data);
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
        if (this.props.toolbars[this.props.id].config.showTextEditor) {
            this.refs.textarea.focus();
        }
    }
    componentWillReceiveProps(nextProps) {
        if (this.props.boxSelected === this.props.id && nextProps.boxSelected !== nextProps.id) {
            this.onBlur();
        }
        if (nextProps.boxSelected === nextProps.id) {
            if (this.props.toolbars[this.props.id].showTextEditor === true && nextProps.toolbars[nextProps.id].showTextEditor === false) {
                this.onBlur();
            } else if (this.props.toolbars[this.props.id].showTextEditor === false && nextProps.toolbars[nextProps.id].showTextEditor === true) {
                this.refs.textarea.focus();
                console.log('focusando');
                // Elimina el placeholder "Introduzca texto aquí" cuando se va a editar
                // Código duplicado en EditorBox, EditorShortcuts y PluginToolbar. Extraer a common_tools?
                let CKstring = CKEDITOR.instances[nextProps.id].getData();
                let initString = "<p>" + i18n.t("text_here") + "</p>\n";
                if(CKstring === initString) {
                    CKEDITOR.instances[nextProps.id].setData("");
                }
            }
        }
    }

}
