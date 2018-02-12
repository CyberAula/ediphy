import React, { Component } from 'react';
import Wrapper from './Wrapper';
import { Col, Row } from 'react-bootstrap';
import demo from '../../img/demo.png';
import i18n from 'i18next';
/* eslint-disable react/prop-types */

export default class When extends Component {
    render() {
        return (<Wrapper id="when">
            <Row>
                <Col xs={12} >
                    <h2><span style={{ color: 'white' }}>EDiphy</span> demo</h2>
                    <h3>{i18n.t("Home.When.Subheader")}</h3>
                    <img className="demoComputer" src={demo} onClick={()=>{window.location = "demo/editor.html";}}/>
                </Col>
            </Row>
        </Wrapper>);
    }
}
/* eslint-enable react/prop-types */
