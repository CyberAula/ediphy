import React from 'react';
import SCORM_API from '../../core/scorm/SCORM_API';
/* eslint-disable react/prop-types */

export default class ScormIframeWrapper extends React.Component {
    render() {
        let url = '/lib/scorm/dist/scorm_iframe.html?url=' + encodeURI(this.props.url);

        // return (<iframe className="scormcontent" ref="scormcontent" style={{ width: '100%', height: '100%', zIndex: 0, border: 'none' }} src={url}/>);
        return (<iframe id="myIframe" src="http://vishubcode.org/scorm/packages/229/vishubcode_scorm_wrapper.html" style={{ width: '100%', height: '100%', zIndex: 0, border: 'none' }} objecttype="scormpackage" webkitAllowFullScreen="true" allowFullScreen="true" mozallowfullscreen="true" />);
    }
    componentDidMount() {
        window.addEventListener('message', function(ev) {
            console.log(ev);
            try {
                let msg = JSON.parse(ev.data);
                console.log(ev, msg);
                ev.source.postMessage("stopHelloExchange", '*');

            } catch(e) {}
        });

        /*
        // SCORM URL
        let scormpackageURL = this.props.url;
        let scormResourceURLs = [scormpackageURL];

        // Create SCORM LMS API
        let API_1484_11 = new window.Local_API_1484_11({ debug: LMS_CONFIG.debug, CMI: { learner_preference: LMS_CONFIG.scorm2004.learner_preference } });

        // Create SCORM player
        let SCORM_Player = new window.SCORM_Player({ debug: LMS_CONFIG.debug_scorm_player, SCORM_VERSION: "2004", LMS_API: window.API_1484_11, IFRAME_API: window.SCORM_IFRAME_API, SCORM_PACKAGE_URL: scormpackageURL, SCORM_RESOURCE_URLS: scormResourceURLs });

        SCORM_Player.loadScormContent(function() {
            // SCORM content loaded
            if(window.LMS_CONFIG.debug_scorm_player) {
                // console.log("SCORM content succesfully loaded");
            }
        }, this.refs.scormcontent /!*document.getElementById("scormcontent")*!/);*/
    }
}
/* eslint-enable react/prop-types */
