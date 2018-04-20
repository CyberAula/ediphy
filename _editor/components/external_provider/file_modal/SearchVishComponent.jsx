import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Modal, FormControl, Col, Form, FormGroup, ControlLabel, Button } from 'react-bootstrap';
import Ediphy from '../../../../core/editor/main';
import i18n from 'i18next';
import PropTypes from 'prop-types';

export default class SearchVishComponent extends React.Component {
    render() {
        return (
            <div>
                <Form horizontal action="javascript:void(0);">
                    <FormGroup>
                        <Col md={4}>
                            <ControlLabel>{i18n.t("vish_search_terms")}</ControlLabel>
                            <FormControl ref="query" type="text"/>
                        </Col>
                        <Col md={3}>
                            <ControlLabel>{i18n.t("vish_search_by_type")}</ControlLabel>
                            <FormControl ref="type" componentClass="select">
                                <option value="Picture">{i18n.t("vish_search_types.Picture")}</option>
                                {/*
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
                                 */}
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
                            <Button type="submit" className="btn-primary" onClick={(e) => {
                                let url = encodeURI(Ediphy.Config.search_vish_url +
                                    "?q=" + ReactDOM.findDOMNode(this.refs.query).value +
                                    "&type=" + ReactDOM.findDOMNode(this.refs.type).value +
                                    "&sort_by=" + ReactDOM.findDOMNode(this.refs.sort_by).value
                                );

                                this.props.onFetchVishResources(url);
                                e.preventDefault();
                            }}>{i18n.t("vish_search_button")}
                            </Button>
                        </Col>
                    </FormGroup>

                </Form>
                <Form style={{ minHeight: 250 }}>
                    {this.props.fetchResults.total_results_delivered ?
                        (
                            <FormGroup>
                                <ControlLabel>{ this.props.fetchResults.total_results_delivered + " Resultados"}</ControlLabel>
                                <br />
                                {this.props.fetchResults.results.map((item, index) => {
                                    console.log(item);
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
                                <ControlLabel>{process.env.NODE_ENV === 'production' && process.env.DOC !== 'doc' ? this.props.isBusy.msg : ''}</ControlLabel>
                            </FormGroup>
                        )
                    }
                </Form>
            </div>
        );
    }
    componentWillUpdate(nextProps, nextState) {
        if (nextProps.fetchResults.total_results_delivered && (nextProps.fetchResults.total_results_delivered !== this.props.fetchResults.total_results_delivered)) {
            this.props.onElementSelected(nextProps.fetchResults.results[0].title, nextProps.fetchResults.results[0].file_url, 'image');

        }
    }
    resetState() {
        this.props.onElementSelected(undefined, undefined, undefined);

    }
}
SearchVishComponent.propTypes = {
    /**
     * Resultados obtenidos de la búsqueda en el proveedor externo
     * */
    fetchResults: PropTypes.object,
    /**
     * Función para mostrar la búsqueda externa
     * */
    onExternalSearcherToggled: PropTypes.func,
    /**
     * Función para obtener resultados del proveedor externo
     */
    onFetchVishResources: PropTypes.func,
    /**
     * Indicador de si hay una operación en curso con el servidor
     */
    isBusy: PropTypes.any,
};
