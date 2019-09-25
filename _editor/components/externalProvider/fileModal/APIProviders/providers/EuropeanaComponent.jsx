import React from 'react';
import i18n from 'i18next';
import { ImagesPreview } from "./ImagesPreview";

export default class EuropeanaComponent extends React.Component {

    state = {
        results: [],
        query: '',
        msg: i18n.t("FileModal.APIProviders.no_files"),
    };

    render = () => ImagesPreview(this);

    onSearch = (text) => {
        const BASE = 'https://www.europeana.eu/api/v2/search.json?wskey=ZDcCZqSZ5&query=' + (text || "europeana") + '&qf=TYPE:IMAGE&profile=RICH&media=true&rows=100&qf=IMAGE_SIZE:small';
        this.setState({ msg: i18n.t("FileModal.APIProviders.searching"), results: [] });
        fetch(encodeURI(BASE))
            .then(res => res.text()
            ).then(imgStr => {
                let imgs = JSON.parse(imgStr);
                if (imgs && imgs.items) {
                    let results = imgs.items.map(img=>{
                        return {
                            title: img.title[0],
                            url: img.edmIsShownBy,
                            thumbnail: img.edmPreview,
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
