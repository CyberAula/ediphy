import React from 'react';
import PropTypes from 'prop-types';
import { Modal, FormControl, Col, Form, FormGroup, ControlLabel, Button } from 'react-bootstrap';
import Ediphy from '../../../../../../core/editor/main';
import i18n from 'i18next';
import ReactDOM from 'react-dom';
import SearchComponent from '../common/SearchComponent';

import placeholder from '../logos/soundcloud_placeholder.png';
export default class SoundCloudComponent extends React.Component {

    state = {
        results: [],
        query: '',
        msg: 'No hay resultados',
    };

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
                                return (<div>
                                    <img key={index}
                                        src={item.thumbnail || placeholder}
                                        className={'soundCloudSong'}
                                        style={{
                                            width: '100px',
                                            height: '100px',
                                            backgroundColor: '#ddd',
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
                            <ControlLabel id="serverMsg">{this.state.msg}</ControlLabel>
                        </FormGroup>
                    )
                }
            </Form>
        </div>;
    }

    onSearch = (text) => {
        const BASE = 'https://api.audioblocks.com/api/search?srch-term=' + encodeURI(text) + '&srch-type=music&callback=?';
        this.setState({ msg: 'Buscando...' });
        fetch((BASE), {
            jsonpCallback: '1',
            mode: 'no-cors',
            json: true,
        })
            .then(res => { return res.json();}
            ).then(audioStr => {
                let songs = (audioStr);
                if (songs) {
                    let results = Object.keys(songs.data.stockItems).map(a=>{
                        let s = songs.data.stockItems[a].stockItem;
                        return { title: s.title, url: s.previewUrl, thumbnail: s.thumbnailUrl };
                    });

                    this.setState({ results, msg: results.length > 0 ? '' : 'No hay resultados' });
                }
            }).catch(e=>{
                // eslint-disable-next-line no-console
                console.error(e);
                this.setState({ msg: 'Ha habido un error' });
            });
    };
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
    /**
     * Icon that identifies the API provider
     */
    icon: PropTypes.any,
    /**
     * API Provider name
     */
    name: PropTypes.string,
};
