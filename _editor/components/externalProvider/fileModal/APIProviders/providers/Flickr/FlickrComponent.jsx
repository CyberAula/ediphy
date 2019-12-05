import React from 'react';
import i18n from 'i18next';

import { ImagesPreview } from "../ImagesPreview";

export default class FlickrComponent extends React.Component {

    state = {
        results: [],
        query: '',
        msg: i18n.t("FileModal.APIProviders.no_files"),
    };

    render = () => ImagesPreview(this);

    onSearch = (text) => {
        let flickrURL = "http://api.flickr.com/services/feeds/photos_public.gne?tags=" + encodeURI(text) + "&tagmode=any&format=json&jsoncallback=?";
        this.setState({ msg: i18n.t("FileModal.APIProviders.searching"), results: [] });
        $.getJSON(flickrURL, (imgs)=>{
            try{
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
                // eslint-disable-next-line no-console
                console.error(e);
                this.setState({ msg: i18n.t("FileModal.APIProviders.error") });
            }

        });
    };
}
