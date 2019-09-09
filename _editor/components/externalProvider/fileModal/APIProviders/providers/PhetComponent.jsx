import React from 'react';
import PropTypes from 'prop-types';
import { Col, Form, FormGroup, ControlLabel, Button } from 'react-bootstrap';
import i18n from 'i18next';
import SearchComponent from '../common/SearchComponent';
import ImageComponent from '../common/ImageComponent';

export default class PhetComponent extends React.Component {
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
                                return (<ImageComponent key={index} url={item.url} title={item.title} onElementSelected={this.props.onElementSelected} isSelected={item.url === this.props.elementSelected}/>);
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

    onSearch = () => {

        let PhetURL = "https://phet.colorado.edu/en/simulations/category/html";
        /* $.getJSON('https://phet.colorado.edu/en/simulations/category/html&callback=?', function(response) {
            console.log(response)
        });*/
        $.ajax({
            method: 'GET',
            url: PhetURL,
            dataType: 'jsonp', // change the datatype to 'jsonp' works in most cases
            success: (res) => {
                // eslint-disable-next-line no-console
                console.log(res);
            },
        });
        /* let flickrURL = "http://api.flickr.com/services/feeds/photos_public.gne?tags=" + encodeURI(text) + "&tagmode=any&format=json&jsoncallback=?";
        this.setState({ msg: i18n.t("FileModal.APIProviders.searching"), results: [] });
        $.getJSON(flickrURL, (imgs)=>{
            try{
                // console.log(imgs);
                if (imgs) {
                    if (imgs && imgs.items) {
                        let results = imgs.items.map(img=>{
                            return {
                                title: img.title,
                                url: img.media.m.replace(/_m/i, ""),
                            };
                        });
                        this.setState({ results, msg: results.length > 0 ? '' : i18n.t("FileModal.APIProviders.no_files") });
                    }
                }
            } catch (e) {
                console.error(e);
                this.setState({ msg: i18n.t("FileModal.APIProviders.error") });
            }

        });*/

        /*        fetch(encodeURI(BASE) )
         .then(res => res.text()
         ).then(imgStr => {
         console.log(imgStr)
         let imgs = JSON.parse(imgStr)
         if (imgs && imgs.items) {
         let results = imgs.items.map(img=>{
         return {
         title: img.title,
         url: img.media.m,
         }
         })

         this.setState({results})
         }
         }).catch(e=>{
         console.error(e)
         });*/
    };
}
PhetComponent.propTypes = {
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
