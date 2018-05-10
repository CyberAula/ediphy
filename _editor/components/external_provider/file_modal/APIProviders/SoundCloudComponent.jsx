import React from 'react';
import PropTypes from 'prop-types';
import { Modal, FormControl, Col, Form, FormGroup, ControlLabel, Button } from 'react-bootstrap';
import Ediphy from '../../../../../core/editor/main';
import i18n from 'i18next';
import ReactDOM from 'react-dom';
import SearchComponent from './SearchComponent';

import placeholder from './logos/soundcloud_placeholder.png';
export default class SoundCloudComponent extends React.Component {
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
            <Form style={{ minHeight: 260, overflowY: 'auto', maxHeight: 450 }}>
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
                                            this.props.onElementSelected(item.title, item.url, 'video');
                                        }}>
                                        <img key={index} src={item.thumbnail || placeholder} className={'soundCloudSong'} />
                                        <div className={"videoInfo"}>
                                            <div><strong>{item.title}</strong></div>
                                            <div className={"lightFont"}>{item.userName}</div>
                                            <div className={"lightFont"}>{duration.toLocaleString(undefined, { minute: '2-digit', second: '2-digit' })}</div>
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
        const BASE = 'https://api.soundcloud.com/tracks?client_id=bb5aebd03b5d55670ba8fa5b5c3a3da5&q=' + text + '&format=json';
        this.setState({ msg: i18n.t("FileModal.APIProviders.searching") });
        fetch(encodeURI(BASE))
            .then(res => res.text()
            ).then(audioStr => {
                let songs = JSON.parse(audioStr);
                console.log(songs);
                if (songs) {
                    let results = songs.map(song=>{
                        return {
                            title: song.title,
                            userName: song.user.username,
                            duration: song.duration,
                            url: song.stream_url,
                            thumbnail: song.artwork_url, // TODO Add default
                        };
                    });

                    this.setState({ results, msg: results.length > 0 ? '' : i18n.t("FileModal.APIProviders.no_files") });
                }
            }).catch(e=>{
                console.error(e);
                this.setState({ msg: i18n.t("FileModal.APIProviders.error") });
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
