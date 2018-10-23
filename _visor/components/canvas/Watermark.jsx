import React, { Component } from 'react';
export default class Watermark extends Component {
    render() {
        let parent = this.whichDomain(window.parent.location.href);
        let current = this.whichDomain(window.location.href) || "http://vishub.org";
        return parent ? null : <span className="watermark">This resource was created using <a href={current}>Ediphy</a></span>;
    }
    whichDomain(windowUrl) {
        let allowedDomains = ["vishub.org", "educainternet.es", "localhost:8080", "ging.github.io/ediphy", "ging.github.com/ediphy"];
        let allowedDomainsHref = [(id)=>"https://vishub.org/ediphy_documents" + id, (id)=>"https://educainternet.es/ediphy_documents" + id, "https://ging.github.io/ediphy", "https://ging.github.io/ediphy", "https://ging.github.com/ediphy"];
        let allowedDomain = false;
        allowedDomains.map((domain, i)=>{
            if (windowUrl.indexOf(domain) > -1) {
                let match = windowUrl.match(/ediphy_documents\/(\d+)/);

                if(match && match[1]) {
                    allowedDomain = allowedDomainsHref[i](match[1]);
                } else {
                    allowedDomain = allowedDomainsHref[i];
                }
            }
        });
        return allowedDomain;
    }
}
