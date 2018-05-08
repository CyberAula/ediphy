import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Modal, FormControl, Col, Form, FormGroup, ControlLabel, Button } from 'react-bootstrap';
import Ediphy from '../../../../../core/editor/main';
import i18n from 'i18next';
import PropTypes from 'prop-types';
import SearchComponent from './SearchComponent';

export default class SearchVishComponent extends React.Component {
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
        return (
            <div>
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
                {/* <Form horizontal action="javascript:void(0);">
                    <FormGroup>
                        <Col md={4}>
                            <ControlLabel>{i18n.t("vish_search_terms")}</ControlLabel>
                            <FormControl autoFocus ref="query" type="text"/>
                        </Col>
                        <Col md={3}>
                            <ControlLabel>{i18n.t("vish_search_by_type")}</ControlLabel>
                            <FormControl autoFocus ref="type" componentClass="select">
                                <option value="Picture">{i18n.t("vish_search_types.Picture")}</option>

                                 <option value="Resource">All</option>
                                 <option value="Audio">Audio</option>
                                 <option value="Embed">Embed</option>
                                 <option value="Excursion">Excursion</option>
                                 <option value="Swf">Flash Object</option>
                                 <option value="Link">Link</option>
                                 <option value="Officedoc">Office Document</option>
                                 <option value="Scormfile">SCORM Package</option>
                                 <option value="Video">Video</option>
                                 <option value="Webapp">Web Application</option>
                                 <option value="Workshop">Workshop</option>
                                 <option value="Writing">Writing</option>
                                 <option value="Zipfile">ZIP File</option>

                            </FormControl>
                        </Col>
                        <Col md={3}>
                            <ControlLabel>{i18n.t("vish_search_by")}</ControlLabel>
                            <FormControl ref="sort_by" componentClass="select">
                                <option value="ranking">{i18n.t("vish_search_filters.ranking")}</option>
                                <option value="popularity">{i18n.t("vish_search_filters.popularity")}</option>
                                <option value="modification">{i18n.t("vish_search_filters.modification")}</option>
                                <option value="creation">{i18n.t("vish_search_filters.creation")}</option>
                                <option value="visits">{i18n.t("vish_search_filters.visits")}</option>
                                <option value="favorites">{i18n.t("vish_search_filters.favorites")}</option>
                                <option value="quality">{i18n.t("vish_search_filters.quality")}</option>
                            </FormControl>
                        </Col>
                        <Col md={2}>
                            <br/>
                            <Button type="submit" className="btn-primary" onClick={onSearch}>
                                {i18n.t("vish_search_button")}
                            </Button>
                        </Col>
                    </FormGroup>

                </Form>*/}
                <Form style={{ minHeight: 240 }}>
                    {this.state.results.length > 0 ?
                        (
                            <FormGroup>
                                <ControlLabel>{ this.state.results.length + " " + i18n.t("FileModal.APIProviders.results")}</ControlLabel>
                                <br />
                                {this.state.results.map((item, index) => {
                                    let border = item.file_url === this.props.elementSelected ? "solid orange 3px" : "solid transparent 3px";
                                    return (
                                        <img key={index}
                                            src={item.file_url}
                                            className={'catalogImage'}
                                            style={{
                                                border: border,
                                            }}
                                            onClick={e => {
                                                this.props.onElementSelected(item.title, item.file_url, 'image');
                                            }}
                                        />
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
            </div>
        );
    }
    componentWillUpdate(nextProps, nextState) {
        if (this.state.results.length && (nextState.results.length !== this.state.results.length)) {
            this.props.onElementSelected(nextState.results[0].title, nextState.results[0].file_url, 'image');

        }
    }
    resetState() {
        this.props.onElementSelected(undefined, undefined, undefined);

    }
    onSearch(text) {
        let query = encodeURI(Ediphy.Config.search_vish_url +
            "?q=" + text +
            "&type=" + "Picture" /* ReactDOM.findDOMNode(this.refs.type).value */ +
            "&sort_by=" + "created");

        this.setState({ msg: i18n.t("FileModal.APIProviders.searching") });

        fetch(query)
            .then(response => {
                if (response.status >= 400) {
                    throw new Error(i18n.t("error.searching"));
                }
                return response.text();
            })
            .then(result => {

                let results = JSON.parse(result).results;
                this.setState({ results, msg: results.length > 0 ? '' : i18n.t("FileModal.APIProviders.no_files") });
                return true;
            })
            .then(() => {
                // dispatch(setBusy(false, i18n.t("no_results")));
            })
            .catch(e => {
                // eslint-disable-next-line no-console
                console.error(e);
                this.setState({ msg: i18n.t("FileModal.APIProviders.error") });
                // dispatch(setBusy(false, e.message));
            });
    }
}

SearchVishComponent.propTypes = {
    /**
     * Selected Element
     */
    elementSelected: PropTypes.any,
    /**
     * Select element callback
     */
    onElementSelected: PropTypes.func.isRequired,
    /**
     * Resultados obtenidos de la búsqueda en el proveedor externo
     * */
    fetchResults: PropTypes.object,
    /**
     * Indicador de si hay una operación en curso con el servidor
     */
    isBusy: PropTypes.any,
};
