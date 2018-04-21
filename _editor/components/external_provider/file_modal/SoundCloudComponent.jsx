import React from 'react';
import PropTypes from 'prop-types';
import { Modal, FormControl, Col, Form, FormGroup, ControlLabel, Button } from 'react-bootstrap';
import Ediphy from '../../../../core/editor/main';
import i18n from 'i18next';
import ReactDOM from 'react-dom';

import placeholder from './logos/soundcloud_placeholder.png';
export default class SoundCloudComponent extends React.Component {
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
                        <FormControl ref="query" type="text"/>
                    </Col>
                    <Col md={2}>
                        <Button type="submit" className="btn-primary" onClick={(e) => {

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
                                return (<div>
                                    <img key={index}
                                        src={item.thumbnail || placeholder}
                                        className={'soundCloudSong'}
                                        style={{
                                            border: border,
                                        }}
                                        onClick={e => {
                                            this.props.onElementSelected(item.title, item.url, 'video');
                                        }}
                                    /><span>{item.title}</span></div>
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
        const BASE = 'https://api.soundcloud.com/tracks?client_id=bb5aebd03b5d55670ba8fa5b5c3a3da5&q=' + text + '&format=json';
        fetch(encodeURI(BASE))
            .then(res => res.text()
            ).then(audioStr => {
                console.log(audioStr);
                let songs = JSON.parse(audioStr);
                console.log(songs);
                if (songs) {
                    let results = songs.map(song=>{
                        return {
                            title: song.title,
                            url: song.stream_url,
                            thumbnail: song.artwork_url, // TODO Add default
                        };
                    });

                    this.setState({ results });
                }
            }).catch(e=>{
                console.error(e);
            });
    }
}
SoundCloudComponent.propTypes = {
    /**
     * Selected Element
     */
    elementSelected: PropTypes.any,
    /**
     * Select element callback
     */
    onElementSelected: PropTypes.func.isRequired,
};
