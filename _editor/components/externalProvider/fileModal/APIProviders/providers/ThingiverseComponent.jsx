import React from 'react';
import PropTypes from 'prop-types';
import { Col, Form, FormGroup, ControlLabel, Button } from 'react-bootstrap';
import i18n from 'i18next';
import SearchComponent from '../common/SearchComponent';
import placeholder from '../logos/soundcloud_placeholder.png';

export default class ThingiverseComponent extends React.Component {
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
                            {this.state.results.map((item, index) => {
                                let border = item.url === this.props.elementSelected ? "solid #17CFC8 2px" : "solid transparent 2px";
                                let background = item.url === this.props.elementSelected ? "rgba(23,207,200,0.1)" : "transparent";
                                return (<div
                                    className={"audioItem"} key={index} style={{ border: border, backgroundColor: background }}
                                    onClick={() => {
                                        this.props.onElementSelected(item.title, item.url, 'application');
                                    }}>
                                    <img key={index} src={item.thumbnail || placeholder} className={'soundCloudSong'} onError={(e)=>{
                                        e.target.src = placeholder;
                                    }} />
                                    <div className={"videoInfo"}>
                                        <div><strong>{item.title}</strong></div>
                                        <div className={"lightFont"}>{item.userName}</div>
                                    </div>
                                </div>);
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

        let BASE_URL = "https://api.thingiverse.com/search/" + encodeURI(text) + "?access_token=ba43247763f24b07796999ce24d0e2d6";
        this.setState({ msg: i18n.t("FileModal.APIProviders.searching") });
        fetch(BASE_URL)
            .then(res => { return res.json();})
            .then(objs => {
                if (objs) {
                    let results = objs.map(s=>{
                        return { title: s.name, url: 'https://www.thingiverse.com/download:' + s.id, thumbnail: s.thumbnail, userName: (s.creator && s.creator.name) ? s.creator.name : 'Unknown' };
                    });
                    this.setState({ results, msg: results.length > 0 ? '' : 'No hay resultados' });

                } else {
                    this.setState({ results: [], msg: 'No hay resultados' });
                }

            }).catch(e=>{
                // eslint-disable-next-line no-console
                console.error(e);
                this.setState({ msg: 'Ha habido un error' });
            });
    };
}
ThingiverseComponent.propTypes = {
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
