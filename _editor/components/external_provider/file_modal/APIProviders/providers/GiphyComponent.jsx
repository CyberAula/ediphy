import React from 'react';
import PropTypes from 'prop-types';
import { Modal, FormControl, Col, Form, FormGroup, InputGroup, Glyphicon, ControlLabel, Button } from 'react-bootstrap';
import Ediphy from '../../../../../../core/editor/main';
import i18n from 'i18next';
import ReactDOM from 'react-dom';
import SearchComponent from '../common/SearchComponent';
import ImageComponent from '../common/ImageComponent';
import attribution from '../logos/PoweredBy_200px-White_HorizText.png';
export default class GiphyComponent extends React.Component {

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
                    ([<img key="0" className="attribution" src={attribution}/>,
                        <FormGroup key="1">
                            <ControlLabel>{ this.state.results.length + " " + i18n.t("FileModal.APIProviders.results")}</ControlLabel>
                            <br />
                            {this.state.results.map((item, index) => {
                                let border = item.url === this.props.elementSelected ? "solid #17CFC8 3px" : "solid transparent 3px";
                                return (<ImageComponent item={item} title={item.title} url={item.url} thumbnail={item.thumbnail} onElementSelected={this.props.onElementSelected} isSelected={item.url === this.props.elementSelected} />
                                );
                            })}
                        </FormGroup>]
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
        const API_KEY = "?api_key=5hg9DsqhxUmAbgvhtnAbvV3vUXA2VISo";
        const BASE = text ? ('http://api.giphy.com/v1/gifs/search' + API_KEY + '&q=' + text) : ('http://api.giphy.com/v1/gifs/trending' + API_KEY);
        this.setState({ msg: i18n.t("FileModal.APIProviders.searching"), results: [] });
        fetch(encodeURI(BASE))
            .then(res => res.text()
            ).then(imgStr => {
                let imgs = JSON.parse(imgStr);
                if (imgs && imgs.data) {
                    let results = imgs.data.map(img=>{
                        return {
                            title: img.title,
                            thumbnail: img.images.fixed_height_downsampled.url,
                            url: img.images.original.url,
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
GiphyComponent.propTypes = {
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
