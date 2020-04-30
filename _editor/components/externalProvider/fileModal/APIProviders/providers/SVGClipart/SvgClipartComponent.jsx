import React from 'react';
import i18n from 'i18next';

import { ImagesPreview } from "../ImagesPreview";

export default class SvgClipartComponent extends React.Component {
    state = {
        results: [],
        query: '',
        msg: i18n.t("FileModal.APIProviders.no_files"),
    };

    render = () => ImagesPreview(this);

    onSearch = (text) => {
        const BASE_OPENCLIPART = "https://freesvgclipart.com";
        const BASE = BASE_OPENCLIPART + "/wp-json/clipart/api?page=1&num=20&query=" + encodeURI(text);
        this.setState({ msg: i18n.t("FileModal.APIProviders.searching"), results: [] });
        fetch(BASE)
            .then(res => res.json()
            ).then(imgs => {
                if (imgs && imgs.items) {
                    let results = imgs.items.map(img=>{
                        return {
                            title: img.title,
                            url: (img.svgurl || img.svg.png_2400px),
                            thumbnail: (img.svgurl || img.svg.png_thumb),
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
