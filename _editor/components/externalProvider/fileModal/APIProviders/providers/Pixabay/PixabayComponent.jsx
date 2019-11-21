import React from 'react';
import i18n from 'i18next';

import { ImagesPreview } from "../ImagesPreview";

export default class PixabayComponent extends React.Component {
    constructor(props) {
        super(props);
        this.onSearch = this.onSearch.bind(this);
    }
    state = {
        results: [],
        query: '',
        msg: i18n.t("FileModal.APIProviders.no_files"),
    };

    render = () => ImagesPreview(this);

    onSearch(text) {
        const BASE = "https://pixabay.com/api/?key=14212908-b76b2fe79bc5d3c216e4b4d4e&q=" + encodeURI(text) + "&image_type=photo";
        this.setState({ msg: i18n.t("FileModal.APIProviders.searching"), results: [] });
        $.getJSON(BASE, (imgs)=>{
            try{
                if (imgs) {
                    if (imgs && imgs.hits) {
                        let results = imgs.hits.map(img=>{
                            return {
                                title: String(img.id),
                                url: img.largeImageURL,
                                thumnnail: img.previewURL,
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
    }
}
