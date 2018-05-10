import React from 'react';
import PropTypes from 'prop-types';
import { Modal, FormControl, Col, Form, FormGroup, ControlLabel, Button } from 'react-bootstrap';
import Ediphy from '../../../../../core/editor/main';
import i18n from 'i18next';
import ReactDOM from 'react-dom';
import SearchComponent from './SearchComponent';

export default class YoutubeComponent extends React.Component {
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
            <Form style={{ minHeight: 240, overflowY: 'auto', maxHeight: 450 }}>
                {this.state.results.length > 0 ?
                    (
                        <FormGroup>
                            <ControlLabel>{ this.state.results.length + " " + i18n.t("FileModal.APIProviders.results")}</ControlLabel>
                            <br />
                            {this.state.results.map((item, index) => {
                                let border = item.url === this.props.elementSelected ? "solid orange 3px" : "solid white 3px";
                                return (<div>
                                    <img key={index}
                                        src={item.thumbnail}
                                        className={'youtubeVideo'}
                                        style={{
                                            width: '126px',
                                            height: '96px',
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

    onSearch(text) {
        this.setState({ msg: i18n.t("FileModal.APIProviders.searching") });
        fetch(encodeURI('https://www.googleapis.com/youtube/v3/search?part=id,snippet&maxResults=20&q=' + text + '&key=AIzaSyAMOw9ufNTZAlg5Xvcht9PhnBYjlY0c9z8&videoEmbeddable=true&type=video'))
            .then(res => res.text()
            ).then(videosStr => {
                let videos = JSON.parse(videosStr);
                if (videos.items) {
                    let results = videos.items.map(video => {
                        return {
                            title: video.snippet.title,
                            url: "https://www.youtube.com/embed/" + (video.id ? video.id.videoId : ''),
                            thumbnail: (video.snippet && video.snippet.thumbnails && video.snippet.thumbnails.default && video.snippet.thumbnails.default.url) ? video.snippet.thumbnails.default.url : "",
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
YoutubeComponent.propTypes = {
    /**
     * Selected Element
     */
    elementSelected: PropTypes.any,
    /**
     * Select element callback
     */
    onElementSelected: PropTypes.func.isRequired,
};
