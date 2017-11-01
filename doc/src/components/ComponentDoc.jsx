import React, { Component } from 'react';
import { Panel } from 'react-bootstrap';
import * as doc from './../../importMdFiles';
import i18n from 'i18next';
export default class ComponentDoc extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false,
        };
    }

    render() {
        let component = doc[this.props.component + "_" + i18n.t("lang")];
        if (component) {
            return <div style={{ textAlign: 'right' }}>
                <i className="material-icons" style={{ cursor: 'pointer' }} onClick={e=>{this.setState({ show: !this.state.show });}}>code</i>
                <Panel style={{ display: this.state.show ? 'block' : 'none', textAlign: 'left' }}>
                    <div className="playground" dangerouslySetInnerHTML={{ __html: component.default }}/>
                </Panel>
            </div>;
        }
        return null;

    }
}
