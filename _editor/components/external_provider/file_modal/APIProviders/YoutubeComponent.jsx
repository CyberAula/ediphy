import React from 'react';
import PropTypes from 'prop-types';
import { Col, Form, FormGroup, ControlLabel, Button } from 'react-bootstrap';
import i18n from 'i18next';
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
                            {this.state.results.map((item, index) => {
                                let border = item.url === this.props.elementSelected ? "solid #17CFC8 2px" : "solid transparent 2px";
                                let background = item.url === this.props.elementSelected ? "rgba(23,207,200,0.1)" : "transparent";
                                let date = new Date(item.publishedAt);

                                return (
                                    <div
                                        className={"videoItem"} key={index} style={{ border: border, backgroundColor: background }}
                                        onClick={e => {
                                            this.props.onElementSelected(item.title, item.url, 'video');
                                        }}>
                                        <img key={index} src={item.thumbnail} className={'youtubeVideo'}/>
                                        <div className={"videoInfo"}>
                                            <div><strong>{item.title}</strong></div>
                                            <div className={"lightFont"}>{item.channelTitle}</div>
                                            <div className={"lightFont"}>{date.toLocaleString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}</div>
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
        this.setState({ msg: i18n.t("FileModal.APIProviders.searching") });
        fetch(encodeURI('https://www.googleapis.com/youtube/v3/search?part=id,snippet&maxResults=20&q=' + text + '&key=AIzaSyAMOw9ufNTZAlg5Xvcht9PhnBYjlY0c9z8&videoEmbeddable=true&type=video'))
            .then(res => res.text()
            ).then(videosStr => {
                let videos = JSON.parse(videosStr);
                if (videos.items) {
                    let results = videos.items.map(video => {
                        return {
                            title: video.snippet.title,
                            channelTitle: video.snippet.channelTitle,
                            publishedAt: video.snippet.publishedAt,
                            url: "https://www.youtube.com/embed/" + (video.id ? video.id.videoId : ''),
                            thumbnail: (video.snippet && video.snippet.thumbnails && video.snippet.thumbnails.default && video.snippet.thumbnails.default.url) ? video.snippet.thumbnails.default.url : "",
                        };
                    });
                    this.setState({ results, msg: results.length > 0 ? '' : i18n.t("FileModal.APIProviders.no_files") });
                }
            }).catch(e=>{
                // eslint-disable-next-line no-console
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
    /**
     * Icon that identifies the API provider
     */
    icon: PropTypes.any,
    /**
     * API Provider name
     */
    name: PropTypes.string,
};
