import React from 'react';
import { Modal, FormControl, Col, Form, FormGroup, ControlLabel, Button, ModalBody } from 'react-bootstrap';
import i18n from 'i18next';
import PropTypes from 'prop-types';

import SearchComponent from '../common/SearchComponent';
import { extensionHandlers as extensions } from '../../FileHandlers/FileHandlers';

const categories = {
    "Picture": { label: i18n.t("vish_search_types.Picture"), type: "image", icon: "picture" },
    "Audio": { label: i18n.t("vish_search_types.Audio"), type: "audio", icon: "audiotrack" },
    /* "Embed": { label: i18n.t("vish_search_types.Embed"), type: "embed"},*/
    /* "Excursion": {label: i18n.t("vish_search_types.Excursion"), type: "excursion"},*/
    "Swf": { label: i18n.t("vish_search_types.Swf"), type: "swf", icon: "flash_on" },
    "Link": { label: i18n.t("vish_search_types.Link"), type: "webapp", icon: "link" },
    "Officedoc": { label: i18n.t("vish_search_types.Officedoc"), type: "pdf", icon: "picture_as_pdf" },
    "Scormfile": { label: i18n.t("vish_search_types.Scormfile"), type: "scormpackage", icon: "extension" },
    "Video": { label: i18n.t("vish_search_types.Video"), type: "video", icon: "play_arrow" },
    "Webapp": { label: i18n.t("vish_search_types.Webapp"), type: "webapp", icon: "link" },
    "EdiphyDocument": { label: i18n.t("vish_search_types.EdiphyDocument"), type: "edi", icon: "widgets" },
    "Excursion": { label: i18n.t("vish_search_types.Excursion"), type: "vish", icon: "list" } }
;
const everything = 'Webapp,Scormfile,Link,Audio,Video,Officedoc,Picture,Swf,Excursion,EdiphyDocument';

export default class SearchVishComponent extends React.Component {
    constructor(props) {
        let types = everything;
        super(props);
        for (let e in extensions) {
            let ext = extensions[e];
            if ((this.props.show || '*').match(ext.value)) {
                let filt = Object.keys(categories).filter(cat=>categories[cat].type === ext.value);
                if (filt.length > 0) {
                    types = filt[0];
                }
            }
        }
        this.state = {
            results: [],
            query: '',
            types,
            msg: i18n.t("FileModal.APIProviders.no_files"),
            onlyMyResources: false,
        };
    }
    render() {
        let previewButton = null;
        switch(this.props.elementSelectedType) {
        case "webapp":
        case "pdf":
        case "edi":
        case "vish":
        case "scormpackage":
        case "video":
        case "swf":
            previewButton = <i className="material-icons">remove_red_eye</i>;
            break;
        case "audio":
            previewButton = <i className="material-icons">volume_down</i>;
            break;
        case "image":

        default:
            previewButton = null;

        }

        let results = this.state.results;
        if (this.state.onlyMyResources) {
            results = this.state.results.filter(res => (res.type === this.state.types || everything === this.state.types));
        }

        return (
            <div className="contentComponent">
                <Form horizontal action="javascript:void(0);">
                    <h5>{this.props.icon ? <img className="fileMenuIcon" src={this.props.icon } alt=""/> : this.props.name}
                        <SearchComponent disabled={this.state.onlyMyResources} query={this.state.value} onChange={(e)=>{this.setState({ query: e.target.value });}} onSearch={this.onSearch} />
                        <FormControl disabled={this.props.show !== '*'} value={this.state.types} autoFocus ref="type" className="selectD" componentClass="select" style={{ marginRight: '2%', width: '18%', float: 'right' }} onChange={(e)=>{this.setState({ types: e.target.value });}}>
                            <option value={everything} >All</option>
                            {Object.keys(categories).map((c, key)=>{
                                let cat = categories[c];
                                return <option key={key} value={c}>{cat.label}</option>;
                            })}

                        </FormControl>
                        {Ediphy.Config.includeVishProfile ? <div className="myResourcesFormGroup">
                            <label htmlFor="myResources">Only my resources</label>
                            <input name="myResources" type="checkbox" value={this.state.onlyMyResources} onChange={()=>{this.setState({ onlyMyResources: !this.state.onlyMyResources });}}/>

                        </div> : null}
                    </h5>
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
                    {results.length > 0 ?
                        (
                            <FormGroup>
                                <ControlLabel>{ results.length + " " + i18n.t("FileModal.APIProviders.results")}</ControlLabel>
                                <br />
                                {results.map((item, index) => {
                                    let url = (item.type === "EdiphyDocument" || item.type === "Excursion") ? item.url : item.url_full || item.file_url;
                                    let border = url === this.props.elementSelected ? "solid #17CFC8 2px" : "solid transparent 2px";
                                    let background = url === this.props.elementSelected ? "rgba(23,207,200,0.1)" : "transparent";
                                    let date = new Date();
                                    try {
                                        date = new Date(...(item.updated_at).split("-").reverse());
                                    } catch(e) {}

                                    return (
                                        <div
                                            className={"videoItem"} key={index} style={{ border: border, backgroundColor: background }}
                                            onClick={() => {
                                                this.setState({ preview: false });
                                                let allowClone = item.allow_clone || item.allow_clone === undefined;
                                                this.props.onElementSelected(item.title, url, (item.type && categories[item.type]) ? categories[item.type].type : undefined, undefined, { allowClone });
                                            }}>
                                            <div className={"videoGroupFlex"}>{item.avatar_url ? <img key={index} src={item.avatar_url} className={'youtubeVideo'}/> : <span className="youtubeVideo vishSearchIcon"> <i className="material-icons">{(item.type && categories[item.type]) ? categories[item.type].icon : undefined}</i></span>}
                                                <div className={"videoInfo"}>
                                                    <div><strong>{item.title}</strong></div>
                                                    <div className={"lightFont"}>{item.author}</div>
                                                    <div className={"lightFont"}>{date.toLocaleString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                                                </div></div>
                                            {url === this.props.elementSelected && previewButton ? (
                                                <Button title={i18n.t("Preview")} onClick={(e)=>{this.setState({ preview: !this.state.preview }); e.stopPropagation();}} className={"previewButton"}>
                                                    {previewButton}
                                                </Button>) :
                                                null}

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
                    <Modal className="pageModal previewVideoModal" onHide={()=>{this.setState({ preview: false });}} show={this.state.preview && this.props.elementSelected}>
                        <Modal.Header closeButton><Modal.Title>{i18n.t("Preview")}</Modal.Title></Modal.Header>
                        <ModalBody>
                            {this.generatePreview()}
                        </ModalBody>
                    </Modal>
                </Form>
            </div>
        );
    }
    UNSAFE_componentWillUpdate(nextProps, nextState) {
        let results = this.state.results;
        if (results.length && (nextState.results.length !== results.length && nextState.results.length > 0)) {
            let nextEl = nextState.results[0];
            let type = (nextEl.type && categories[nextEl.type]) ? categories[nextEl.type].type : undefined;
            let allowClone = nextEl.allow_clone || nextEl.allow_clone === undefined;
            this.props.onElementSelected(nextEl.title,
                nextEl.file_url,
                type, undefined, { allowClone });
            // Comprobar ViSH type
            // Poner default thumbnails

        }
    }

    onSearch = (text) => {
        let query = encodeURI(Ediphy.Config.search_vish_url +
            "?q=" + text +
            "&type=" + this.state.types /* ReactDOM.findDOMNode(this.refs.type).value */ +
            "&sort_by=" + "created");
        if (this.state.onlyMyResources) {
            query = Ediphy.Config.profile_vish_url(window.ediphy_editor_params ? (window.ediphy_editor_params.slug || "").toLowerCase() : 1);
        }

        this.setState({ msg: i18n.t("FileModal.APIProviders.searching"), results: [] });

        fetch(query)
            .then(response => {
                if (response.status >= 400) {
                    throw new Error(i18n.t("error.searching"));
                }
                return response.text();
            })
            .then(result => {
                let results = JSON.parse(result).results;
                results = (results && results.length > 0) ? results.filter(res => (res.type === this.state.types || everything === this.state.types)) : [];
                this.setState({ results, msg: results.length > 0 ? '' : i18n.t("FileModal.APIProviders.no_files") });
                return true;
            })
            .then(() => {
                // dispatch(setBusy(false, i18n.t("no_results")));
            })
            .catch(e => {
                // eslint-disable-next-line no-console
                console.error(e);
                this.setState({ msg: i18n.t("FileModal.APIProviders.error") });
                // dispatch(setBusy(false, e.message));
            });
    };

    generatePreview = () => {
        const item = this.props.elementSelected;
        switch(this.props.elementSelectedType) {
        case "vish":
        case "edi":
            return <iframe src={item + ".full"} frameBorder="0" width={'100%'} height={"400"} />;
        case "webapp":
        case "pdf":
        case "scormpackage":
            return <iframe src={item} frameBorder="0" width={'100%'} height={"400"} />;
        case "image":
            return null;
        case "audio":
            return <audio src={item} controls width={'100%'} height={"400"} style={{ width: '100%' }} />;
        case "video":
            return <video src={item} controls width={'100%'} height={"400"} />;
        case "swf":
            return <embed src={item} wmode="opaque" width={'100%'} height={"400"} />;
        default:
            return null;
        }
    };
}

SearchVishComponent.propTypes = {
    /**
     * Selected Element
     */
    elementSelected: PropTypes.any,
    /**
     * Selected Element type
     */
    elementSelectedType: PropTypes.any,
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
    /**
     * Current file filter
     */
    show: PropTypes.any,

};
