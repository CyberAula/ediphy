import React from 'react';
import PropTypes from 'prop-types';
import { Modal, FormControl, Col, Form, FormGroup, ControlLabel, Button } from 'react-bootstrap';
import Ediphy from '../../../../../core/editor/main';
import i18n from 'i18next';
import ReactDOM from 'react-dom';
import SearchComponent from './SearchComponent';

import placeholder from './logos/soundcloud_placeholder.png';
export default class PolyComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            results: [],
            query: '',
            msg: i18n.t("FileModal.APIProviders.no_files"),
        };
        this.onSearch = this.onSearch.bind(this);
    }
    render() {
        return <div className="contentComponent">
            <Form horizontal action="javascript:void(0);">
                <h5>{this.props.icon ? <img className="fileMenuIcon" src={this.props.icon } alt=""/> : this.props.name}
                    <SearchComponent query={this.state.value} onChange={(e)=>{this.setState({ query: e.target.value });}} onSearch={this.onSearch} /></h5>
                <hr />

                <FormGroup>
                    <Col md={2}>
                        <Button type="submit" className="btn-primary hiddenButton" onClick={(e) => {
                            this.onSearch(this.state.query);
                            e.preventDefault();
                        }}>{i18n.t("vish_search_button")}
                        </Button>
                    </Col>
                </FormGroup>

            </Form>
            <Form className={"ExternalResults"}>
                {this.state.results.length > 0 ?
                    (
                        <FormGroup>
                            <ControlLabel>{ this.state.results.length + " " + i18n.t("FileModal.APIProviders.results")}</ControlLabel>
                            <br />
                            {this.state.results.map((item, index) => {
                                let border = item.url === this.props.elementSelected ? "solid #17CFC8 2px" : "solid transparent 2px";
                                let background = item.url === this.props.elementSelected ? "rgba(23,207,200,0.1)" : "transparent";
                                let duration = new Date(item.duration);
                                return (
                                    <div
                                        className={"audioItem"} key={index} style={{ border: border, backgroundColor: background }}
                                        onClick={e => {
                                            this.props.onElementSelected(item.title, item.url, 'webapp');
                                        }}>
                                        <img key={index} src={item.thumbnail || placeholder} className={'polyObj'} onError={(e)=>{
                                            e.target.src = placeholder;
                                        }} />
                                        <div className={"videoInfo"}>
                                            <div><strong>{item.title}</strong></div>
                                            <div className={"lightFont overflowHidden"}>{item.userName}</div>
                                            <div className={"lightFont overflowHidden"}>{item.description}</div>
                                        </div>
                                    </div>
                                );
                            })}
                        </FormGroup>
                    ) :
                    (
                        <FormGroup>
                            <ControlLabel id="serverMsg">{this.state.msg}</ControlLabel>
                        </FormGroup>
                    )
                }
            </Form>
        </div>;
    }

    onSearch(text) {
        const BASE = 'https://poly.googleapis.com/v1/assets?key=AIzaSyBcvRyyiuZVCrbIf3Jb4547rpm5rqTh1pE&format=OBJ&keywords=' + text;
        this.setState({ msg: i18n.t("FileModal.APIProviders.searching"), results: [] });
        fetch(encodeURI(BASE))
            .then(res => res.text()
            ).then(audioStr => {
                let response = JSON.parse(audioStr);
                let objects = response.assets;
                if (objects) {
                    let results = objects.map(obj=>{
                        return {
                            title: obj.displayName,
                            userName: obj.authorName,
                            description: obj.description,
                            url: 'https://poly.google.com/view/' + obj.name.replace("assets/", "") + '/embed', // song.uri
                            thumbnail: obj.thumbnail.url, // TODO Add default
                        };
                    });

                    this.setState({ results, msg: results.length > 0 ? '' : i18n.t("FileModal.APIProviders.no_files") });
                }
            }).catch(e=>{
            // eslint-disable-next-line no-console
                console.error(e);
                this.setState({ msg: i18n.t("FileModal.APIProviders.error") });
            });
    }
}
PolyComponent.propTypes = {
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

