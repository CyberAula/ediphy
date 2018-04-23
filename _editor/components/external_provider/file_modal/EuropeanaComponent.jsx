import React from 'react';
import PropTypes from 'prop-types';
import { Modal, FormControl, Col, Form, FormGroup, InputGroup, Glyphicon, ControlLabel, Button } from 'react-bootstrap';
import Ediphy from '../../../../core/editor/main';
import i18n from 'i18next';
import ReactDOM from 'react-dom';
export default class EuropeanaComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            results: [],
        };
        this.onSearch = this.onSearch.bind(this);
    }
    render() {
        return <div>
            <Form horizontal action="javascript:void(0);">
                <FormGroup>
                    <Col md={4}>
                        <ControlLabel>{i18n.t("vish_search_terms")}</ControlLabel>
                        {/* <FormControl ref="query" type="text"/>*/}
                        <InputGroup>
                            <FormControl autoFocus ref="query" type="text" />
                            <InputGroup.Addon className="inputSearch" onClick={(e) => {

                                this.onSearch(ReactDOM.findDOMNode(this.refs.query).value);
                                e.preventDefault();
                            }}>
                                <Glyphicon glyph="search" />
                            </InputGroup.Addon>
                        </InputGroup>
                    </Col>
                    <Col md={2}>
                        <Button type="submit" className="btn-primary hiddenButton" onClick={(e) => {

                            this.onSearch(ReactDOM.findDOMNode(this.refs.query).value);
                            e.preventDefault();
                        }}>{i18n.t("vish_search_button")}
                        </Button>
                    </Col>
                </FormGroup>

            </Form>
            <Form style={{ minHeight: 250 }}>
                {this.state.results.length > 0 ?
                    (
                        <FormGroup>
                            <ControlLabel>{ this.state.results.length + " Resultados"}</ControlLabel>
                            <br />
                            {this.state.results.map((item, index) => {
                                let border = item.url === this.props.elementSelected ? "solid orange 3px" : "solid transparent 3px";
                                return (
                                    <img key={index}
                                        src={item.url}
                                        className={'catalogImage'}
                                        style={{
                                            border: border,
                                        }}
                                        title={item.title}
                                        onClick={e => {
                                            this.props.onElementSelected(item.title, item.url, 'image');
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
        </div>;
        return <div>TO DO</div>;
    }

    onSearch(text) {
        const BASE = 'https://www.europeana.eu/api/v2/search.json?wskey=ZDcCZqSZ5&query=' + text + '&qf=TYPE:IMAGE&profile=RICH&media=true&rows=100&qf=IMAGE_SIZE:small';
        fetch(encodeURI(BASE))
            .then(res => res.text()
            ).then(imgStr => {
                let imgs = JSON.parse(imgStr);
                if (imgs && imgs.items) {
                    let results = imgs.items.map(img=>{
                        return {
                            title: img.title[0],
                            url: img.edmIsShownBy,
                        };
                    });

                    this.setState({ results });
                }
            }).catch(e=>{
                console.error(e);
            });
    }
}

EuropeanaComponent.propTypes = {
    /**
     * Selected Element
     */
    elementSelected: PropTypes.any,
    /**
     * Select element callback
     */
    onElementSelected: PropTypes.func.isRequired,
};
