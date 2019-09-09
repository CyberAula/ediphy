import React from 'react';
import PropTypes from 'prop-types';
import { Col, Form, FormGroup, ControlLabel, Button } from 'react-bootstrap';
import i18n from 'i18next';
import SearchComponent from '../common/SearchComponent';
import ImageComponent from '../common/ImageComponent';

export default class OpenClipArtComponent extends React.Component {
    state = {
        results: [],
        query: '',
        msg: i18n.t("FileModal.APIProviders.no_files"),
    };

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
                            {this.state.results.map((item) => {
                                return (<ImageComponent item={item} title={item.title} url={item.url} thumbnail={item.thumbnail} onElementSelected={this.props.onElementSelected} isSelected={item.url === this.props.elementSelected} />
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

    onSearch = (text) => {
        const BASE_OPENCLIPART = "https://openclipart.org";
        const BASE = BASE_OPENCLIPART + "/search/json/?query=" + encodeURI(text) + "&amount=20";
        this.setState({ msg: i18n.t("FileModal.APIProviders.searching"), results: [] });
        fetch((BASE))
            .then(res => res.json()
            ).then(imgs => {
                if (imgs && imgs.payload) {
                    let results = imgs.payload.map(img=>{
                        return {
                            title: img.title,
                            url: (img.svg.url || img.svg.png_2400px),
                            thumbnail: (img.svg.url || img.svg.png_thumb),
                        };
                    });

                    this.setState({ results, msg: results.length > 0 ? '' : i18n.t("FileModal.APIProviders.no_files") });
                }
            }).catch(e=>{
                // eslint-disable-next-line no-console
                console.error(e);
                this.setState({ msg: i18n.t("FileModal.APIProviders.error") });
            });
    };
}

OpenClipArtComponent.propTypes = {
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

