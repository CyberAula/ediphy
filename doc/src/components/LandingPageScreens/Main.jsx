import React, { Component } from 'react';
import icon from '../../img/ging.png';
import i18n from 'i18next';
import { Col, Row } from 'react-bootstrap';
import Wrapper from './Wrapper';
/* eslint-disable react/prop-types */
export default class Main extends Component {
    render() {
        return (
            <Wrapper id="main">
                <Row>
                    <Col xs={12}>
                        <div id="mainTitle" >
                            <h1><img src={icon} className="mainLogo" alt=""/>
                                <b>ED</b>iphy</h1>
                            <h2>{i18n.t("Home.Description")}</h2>
                        </div></Col></Row></Wrapper>);
    }
}
/* eslint-enable react/prop-types */
