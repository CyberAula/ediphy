import React from 'react';
import i18n from 'i18next';

import { ImagesPreview } from "../ImagesPreview";

export default class OpenClipArtComponent extends React.Component {
    state = {
        results: [],
        query: '',
        msg: i18n.t("FileModal.APIProviders.no_files"),
    };

    render = () => ImagesPreview(this);

    onSearch = (text) => {
        const BASE_OPENCLIPART = "https://openclipart.org";
        const BASE = BASE_OPENCLIPART + "/search/json/?query=" + encodeURI(text) + "&amount=20";
        this.setState({ msg: i18n.t("FileModal.APIProviders.searching"), results: [] });
        fetch((BASE))
            .then(res => res.json()
            ).then(imgs => {
                if (imgs && imgs.payload) {
                    let results = imgs.payload.map(img=>{
                        return {
                            title: img.title,
                            url: (img.svg.url || img.svg.png_2400px),
                            thumbnail: (img.svg.url || img.svg.png_thumb),
                        };
                    });

                    this.setState({ results, msg: results.length > 0 ? '' : i18n.t("FileModal.APIProviders.no_files") });
                }
            }).catch(e=>{
                // eslint-disable-next-line no-console
                console.error(e);
                this.setState({ msg: i18n.t("FileModal.APIProviders.error") });
            });
    };
}

