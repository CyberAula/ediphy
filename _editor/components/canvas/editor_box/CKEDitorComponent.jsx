import React, { Component } from 'react';

export default class CKEDitorComponent extends Component {
    constructor(props) {
        super(props);
    // this.updateContent = this.updateContent.bind(this);

    }

    onChange(evt) {

    }

    onBlur() {
        console.log('blur');
        CKEDITOR.instances[this.props.id].focusManager.blur(true);

        let data = CKEDITOR.instances[this.props.id].getData();
        if(data.length === 0) {
            data = i18n.t("text_here");
            CKEDITOR.instances[this.props.id].setData(i18n.t("text_here"));
        }
        this.props.onBlur(data);
    }

    render() {
        return (<div id={this.props.id}
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
    // CKEDITOR.instances[this.props.id].setData(decodeURI(this.props.toolbars[this.props.id].state.__text));
    }

    componentWillUnmount() {
        CKEDITOR.instances[this.props.id].destroy();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.id !== this.props.id) {
            this.onBlur();
        }
    }

}
