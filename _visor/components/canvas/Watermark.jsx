import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class Watermark extends Component {
    render() {
        let id = this.props.ediphy_document_id || (window.ediphy_editor_params ? window.ediphy_editor_params.ediphy_resource_id : null);
        let parent = null;
        try {
            parent = this.whichDomain(window.parent.location.href, id);
        } catch(e) {}
        let platform = this.props.ediphy_platform ? (this.props.ediphy_platform + "/ediphy_documents/" + id) : window.location.href;
        let current = this.whichDomain(platform, id) || "https://vishub.org";
        let educa = (current || "").match(/educainternet/) ? " educa" : "";
        return parent ? null : <a target="_blank" href={current}><div className={"embedWaterMark" + educa} /></a>;
    }
    whichDomain(windowUrl, id) {
        let allowedDomains = ["vishub.org", "educainternet.es", "localhost:3000", "localhost:8080", "ging.github.io/ediphy", "ging.github.com/ediphy"];
        let allowedDomainsHref = ["https://vishub.org/ediphy_documents/" + id, "https://educainternet.es/ediphy_documents/" + id, "http://localhost:3000/ediphy_documents/" + id, "https://vishub.org/", "https://ging.github.io/ediphy", "https://ging.github.com/ediphy"];
        let allowedDomain = false;
        allowedDomains.map((domain, i)=>{
            if (windowUrl.indexOf(domain) > -1) {
                // let match = windowUrl.match(/ediphy_documents\/(\d+)/);
                /* if(match && match[1]) {
                    allowedDomain = allowedDomainsHref[i](match[1]);
                } else {*/
                allowedDomain = allowedDomainsHref[i];
                // }
            }
        });
        return allowedDomain;
    }
}

Watermark.propTypes = {
    /**
   * Ediphy Document id
   */
    ediphy_document_id: PropTypes.any,
    /**
   * Platform where excursion is hosted
   */
    ediphy_platform: PropTypes.any,
};
