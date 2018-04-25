import React from 'react';
import PropTypes from 'prop-types';
import { Modal, FormControl, Col, Form, FormGroup, InputGroup, Glyphicon, ControlLabel, Button } from 'react-bootstrap';
import Ediphy from '../../../../../core/editor/main';
import i18n from 'i18next';
import ReactDOM from 'react-dom';
import SearchComponent from './SearchComponent';

export default class EuropeanaComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            results: [],
            query: '',
            msg: 'No hay resultados',
        };
        this.onSearch = this.onSearch.bind(this);
    }
    render() {
        return <div>
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
                            <ControlLabel id="serverMsg">{this.state.msg}</ControlLabel>
                        </FormGroup>
                    )
                }
            </Form>
        </div>;
        return <div>TO DO</div>;
    }

    onSearch(text) {
        const BASE = 'https://www.europeana.eu/api/v2/search.json?wskey=ZDcCZqSZ5&query=' + text + '&qf=TYPE:IMAGE&profile=RICH&media=true&rows=100&qf=IMAGE_SIZE:small';
        this.setState({ msg: 'Buscando...' });
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

                    this.setState({ results, msg: results.length > 0 ? '' : 'No hay resultados' });
                }
            }).catch(e=>{
                console.error(e);

                this.setState({ msg: 'Ha habido un error' });
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
