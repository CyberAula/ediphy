import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Modal, FormControl, Col, Form, FormGroup, ControlLabel, Button, ModalBody } from 'react-bootstrap';
import Ediphy from '../../../../../../core/editor/main';
import i18n from 'i18next';
import PropTypes from 'prop-types';
import SearchComponent from '../common/SearchComponent';
import ImageComponent from '../common/ImageComponent';
import { extensionHandlers as extensions } from '../../FileHandlers/FileHandlers';

export default class LogoComponent extends React.Component {
    render() {
        let numberOfAvatars = window.location.href.indexOf("educainternet") ? 180 : 81;
        let avatars = [];
        for (let i = 1; i <= numberOfAvatars; i++) {
            // let url = `http://educainternet.es/assets/logos/original/excursion-${this.zeroPad(i)}.png`;
            let url = `/assets/logos/original/excursion-${this.zeroPad(i)}.png`;
            if (process.env.DOC === 'doc' || process.env.NODE_ENV !== 'production') {
                url = "https://vishub.org" + url;
            }
            avatars.push(<ImageComponent key={i} url={url} title={"Avatar " + i} onElementSelected={this.props.onElementSelected} isSelected={url === this.props.elementSelected}/>);
        }
        return <div className="contentComponent">
            <Form horizontal action="javascript:void(0);">
                <h5>{this.props.icon ? <img className="fileMenuIcon" src={this.props.icon } alt=""/> : this.props.name} </h5>
                <hr />
            </Form>
            <Form className={"ExternalResults"}>
                {avatars}
            </Form>
        </div>;
    }

    zeroPad(number) {
        if (number < 10) {
            return "0" + number;
        }
        return number;
    }

}

LogoComponent.propTypes = {
    /**
     * Selected Element
     */
    elementSelected: PropTypes.any,
    /**
     * Select element callback
     */
    onElementSelected: PropTypes.func.isRequired,
    /**
     * Icon that identifies the API provider
     */
    icon: PropTypes.any,
    /**
     * API Provider name
     */
    name: PropTypes.string,

};
