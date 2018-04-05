import React from 'react';
import i18n from 'i18next';
import img_broken from './../../dist/images/broken_link.png';
import img_placeholder from './../../dist/images/placeholder.svg';
/* eslint-disable react/prop-types */
export function BasicImage(base) {
    return {
        getConfig: function() {
            return {
                name: 'BasicImage',
                displayName: Ediphy.i18n.t('BasicImage.PluginName'),
                category: 'image',
                flavor: 'react',
                needsConfigModal: false,
                needsTextEdition: false,
                initialWidth: '25%',
                aspectRatioButtonConfig: {
                    location: ["main", "__sortable"],
                    defaultValue: true,
                },
                icon: 'image',
            };
        },
        getToolbar: function(state) {
            return {
                main: {
                    __name: "Main",
                    accordions: {
                        style: {
                            __name: Ediphy.i18n.t('BasicImage.box_style'),
                            icon: 'palette',
                            buttons: {
                                padding: {
                                    __name: Ediphy.i18n.t('BasicImage.padding'),
                                    type: 'number',
                                    value: 0,
                                    min: 0,
                                    max: 100,
                                },
                                backgroundColor: {
                                    __name: Ediphy.i18n.t('BasicImage.background_color'),
                                    type: 'color',
                                    value: '#ffffff',
                                },
                                borderWidth: {
                                    __name: Ediphy.i18n.t('BasicImage.border_size'),
                                    type: 'number',
                                    value: 0,
                                    min: 0,
                                    max: 10,
                                },
                                borderStyle: {
                                    __name: Ediphy.i18n.t('BasicImage.border_style'),
                                    type: 'select',
                                    value: 'solid',
                                    options: ['none', 'hidden', 'dotted', 'dashed', 'solid', 'double', 'groove', 'ridge', 'inset', 'outset', 'initial', 'inherit'],
                                },
                                borderColor: {
                                    __name: Ediphy.i18n.t('BasicImage.border_color'),
                                    type: 'color',
                                    value: '#000000',
                                },
                                borderRadius: {
                                    __name: Ediphy.i18n.t('BasicImage.radius'),
                                    type: 'number',
                                    value: 0,
                                    min: 0,
                                    max: 50,
                                },
                                opacity: {
                                    __name: Ediphy.i18n.t('BasicImage.opacity'),
                                    type: 'range',
                                    value: 1,
                                    min: 0,
                                    max: 1,
                                    step: 0.01,
                                },
                            },
                        },
                        basic: {
                            __name: Ediphy.i18n.t('BasicImage.source'),
                            icon: 'link',
                            buttons: {
                                url: {
                                    __name: 'URL',
                                    type: 'external_provider',
                                    accept: "image/*",
                                    value: state.url,
                                    autoManaged: false,
                                },
                            },
                        },
                    },
                },
            };
        },
        getInitialState: function() {
            return {
                // url: 'http://nemanjakovacevic.net/wp-content/uploads/2013/07/placeholder.png'
                // url: 'http://www.amicus.nieruchomosci.pl/grafika/no-image.png'
                // url: 'https://bytesizemoments.com/wp-content/uploads/2014/04/placeholder.png',
                url: img_placeholder, // Ediphy.Config.image_placeholder,
            };
        },
        getRenderTemplate: function(state) {
            return (<div style={{ width: '100%', margin: '0px', height: '100%' }} >
                <img onClick={()=>{$ediphy$.showPreview();}} ref="img"
                    className="basicImageClass"
                    style={{ width: '100%', height: '100%' }}
                    src={state.url}
                    onError={(e)=>{
                        e.target.onError = null;
                        e.target.src = img_broken; // Ediphy.Config.broken_link;

                    }}/>
                <div className="dropableRichZone noInternetConnectionBox" style={{ display: 'none', width: '100%', height: '100%' }}>
                    <div className="middleAlign">
                        <i className="material-icons dark">signal_wifi_off</i><br/>
                        {i18n.t('messages.no_internet')}
                    </div>
                </div>
            </div>);

        },
        imageClick: function() {
            /* alert("Miaua!");*/
        },
    };
}
/* eslint-enable react/prop-types */
