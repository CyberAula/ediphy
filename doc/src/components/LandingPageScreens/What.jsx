import React, { Component } from 'react';
import Wrapper from './Wrapper';
import { Col, Row } from 'react-bootstrap';

import i18n from 'i18next';
/* eslint-disable react/prop-types */
export default class What extends Component {

    render() {
        let featureList = [i18n.t("Home.What.featureList.editor"), i18n.t("Home.What.featureList.tree"), i18n.t("Home.What.featureList.navigation"), i18n.t("Home.What.featureList.export")];
        let pluginList = [i18n.t("Home.What.pluginList.image"), i18n.t("Home.What.pluginList.text"), i18n.t("Home.What.pluginList.map"), i18n.t("Home.What.pluginList.video"), i18n.t("Home.What.pluginList.exercises"), i18n.t("Home.What.pluginList.web")];
        let pluginIcons = ["crop_original", "text_format", "map", "ondemand_video", "school", "web"];

        return (<Wrapper id="what">
            <Row>
                <Col xs={12} lg={6} lgPush={3} md={10} mdPush={1}>
                    <h2 dangerouslySetInnerHTML={{ __html: i18n.t("Home.What.Header") }}/>
                    <p>{i18n.t("Home.What.Version")}</p>
                    <h3>{i18n.t("Home.What.Subheader")}</h3><br/>
                </Col>
                <Col xs={12}>
                    <ul>
                        {featureList.map((feat, ind)=>{
                            return <li key={ind} className="feature">
                                <span>{feat}</span>
                            </li>;
                        })}
                    </ul>
                    <h3>{i18n.t("Home.What.dnd")}</h3>

                </Col>
                <Col xs={12}>

                    {pluginList.map((plug, ind)=>{

                        return ([<div className="pluginFeature" key={ind}>
                            <i className="material-icons">{pluginIcons[ind]}</i><br/>
                            <span className="pluginName">{plug}</span>
                        </div>, ind === (pluginList.length / 2 - 1) ? <br key="br"/> : null]);
                    })}

                </Col>
            </Row>
        </Wrapper>);
    }
}
/* eslint-enable react/prop-types */
