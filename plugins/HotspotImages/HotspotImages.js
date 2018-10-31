import React from "react";
import i18n from 'i18next';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import MarkEditor from '../../_editor/components/rich_plugins/mark_editor/MarkEditor';
import Mark from '../../common/components/mark/Mark';
import img_broken from './../../dist/images/broken_link.png';
import img_placeholder from './../../dist/images/placeholder.svg';
import './_hotspotsImages.scss';
import Image from "./Image";
/* eslint-disable react/prop-types */

export function HotspotImages(base) {
    return {
        getConfig: function() {
            return {
                name: 'HotspotImages',
                displayName: Ediphy.i18n.t('HotspotImages.PluginName'),
                category: 'image',
                needsConfigModal: false,
                flavor: "react",
                needsTextEdition: false,
                icon: 'image',
                // initialWidth: '25%',
                aspectRatioButtonConfig: {
                    location: ["main", "structure"],
                    defaultValue: true,
                },
                isRich: true,
                marksType: { name: i18n.t("HotspotImages.pos"), key: 'value', format: '[x,y]', default: '50,50', defaultColor: '#000001' },
                createFromLibrary: ['image/*', 'url'],
                searchIcon: true,
                needsPointerEventsAllowed: true,
                // searchIcon: ['image/*', 'url'],
            };
        },
        getToolbar: function(state) {
            return {
                main: {
                    __name: "Main",
                    accordions: {
                        basic: {
                            __name: Ediphy.i18n.t('HotspotImages.source'),
                            icon: 'link',
                            buttons: {
                                url: {
                                    __name: 'URL',
                                    type: 'external_provider',
                                    value: state.url,
                                    accept: "image/*",
                                },
                                allowDeformed: {
                                    __name: Ediphy.i18n.t('HotspotImages.allowDeformed'),
                                    type: "checkbox",
                                    checked: state.allowDeformed,
                                },
                                scale: {
                                    __name: Ediphy.i18n.t('HotspotImages.scale'),
                                    type: "range",
                                    min: 0,
                                    max: 20,
                                    step: 0.2,
                                    value: state.scale || 1,
                                },
                                hyperlink: {
                                    __name: Ediphy.i18n.t('HotspotImages.hyperlink'),
                                    type: 'text',
                                    value: state.hyperlink,
                                    placeholder: Ediphy.i18n.t('HotspotImages.link_placeholder'),
                                },
                            },
                        },
                        style: {
                            __name: Ediphy.i18n.t('HotspotImages.box_style'),
                            icon: 'palette',
                            buttons: {
                                padding: {
                                    __name: Ediphy.i18n.t('HotspotImages.padding'),
                                    type: 'number',
                                    value: 0,
                                    min: 0,
                                    max: 100,
                                },
                                backgroundColor: {
                                    __name: Ediphy.i18n.t('HotspotImages.background_color'),
                                    type: 'color',
                                    value: 'rgba(255,255,255,0)',
                                },
                                borderWidth: {
                                    __name: Ediphy.i18n.t('HotspotImages.border_size'),
                                    type: 'number',
                                    value: 0,
                                    min: 0,
                                    max: 10,
                                },
                                borderStyle: {
                                    __name: Ediphy.i18n.t('HotspotImages.border_style'),
                                    type: 'select',
                                    value: 'solid',
                                    options: ['none', 'hidden', 'dotted', 'dashed', 'solid', 'double', 'groove', 'ridge', 'inset', 'outset', 'initial', 'inherit'],
                                },
                                borderColor: {
                                    __name: Ediphy.i18n.t('HotspotImages.border_color'),
                                    type: 'color',
                                    value: '#000000',
                                },
                                borderRadius: {
                                    __name: Ediphy.i18n.t('HotspotImages.radius'),
                                    type: 'number',
                                    value: 0,
                                    min: 0,
                                    max: 50,
                                },
                                opacity: {
                                    __name: Ediphy.i18n.t('HotspotImages.opacity'),
                                    type: 'range',
                                    value: 1,
                                    min: 0,
                                    max: 1,
                                    step: 0.01,
                                },
                            },
                        },
                    },
                },
            };
        },
        getRichMarkInput: function(state, MarkInput) {
            let div = <div><span>x,y</span><input onChange={(event)=>{MarkInput(event.target.value);}} /></div>;
            return div;
        },
        getInitialState: function() {
            return {
                // url: 'http://nemanjakovacevic.net/wp-content/uploads/2013/07/placeholder.png'
                // url:'http://www.amicus.nieruchomosci.pl/grafika/no-image.png'
                // url: 'https://bytesizemoments.com/wp-content/uploads/2014/04/placeholder.png'
                url: img_placeholder, // Ediphy.Config.image_placeholder,
                allowDeformed: true,
            };
        },
        getDefaultMarkValue(state) {
            return 50 + ',' + 50;
        },
        getRenderTemplate: function(state, props) {
            let marks = props.marks || {};
            // let Mark = ({ idKey, title, style, color }) => (
            //     );
            let markElements = Object.keys(marks).map((id) =>{
                let value = marks[id].value;
                let title = marks[id].title;
                let color = marks[id].color;

                let position;
                if (value && value.split(',').length === 2) {
                    position = value.split(',');
                } else{
                    position = [0, 0];
                }
                return (
                    <MarkEditor key={id} style={{ position: 'absolute', top: position[0] + "%", left: position[1] + "%" }} time={1.5} onRichMarkMoved={props.onRichMarkMoved} mark={id} base={base} marks={marks} state={state}>
                        <Mark style={{ position: 'absolute', top: position[0] + "%", left: position[1] + "%" }} color={color} idKey={id} title={title} />
                    </MarkEditor>
                );
            });

            return (
                <Image markElements={markElements} state={state} props={props}/>
            );
        },
        parseRichMarkInput: function(x, y, width, height, toolbarState, boxId) {
            let xx = (x + 12) * 100 / width;
            let yy = (y + 26) * 100 / height;
            let finalValue = yy.toFixed(2) + "," + xx.toFixed(2);

            return finalValue;
        },
        validateValueInput: function(value) {
            let regex = /(^-*\d+(?:\.\d*)?),(-*\d+(?:\.\d*)?$)/g;
            let match = regex.exec(value);
            if(match && match.length === 3) {
                let x = Math.round(parseFloat(match[1]) * 100) / 100;
                let y = Math.round(parseFloat(match[2]) * 100) / 100;
                if (isNaN(x) || isNaN(y)/* || x > 100 || y > 100 || x < -100 || y < -100*/) {
                    return { isWrong: true, message: i18n.t("HotspotImages.message_mark_xy") };
                }
                value = x + ',' + y;
            } else {
                return { isWrong: true, message: i18n.t("HotspotImages.message_mark_xy") };
            }
            return { isWrong: false, value: value };
        },

    };
}
/* eslint-enable react/prop-types */
