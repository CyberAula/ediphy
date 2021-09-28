import React from 'react';
import { WebPlugin } from "../Styles";
/* eslint-disable react/prop-types */
export function Webpage() {
    return {
        getRenderTemplate: function(state) {
            let url = state.url;
            if (url) {
                if (url.match("poly.google.com")) {
                    return(<WebPlugin visor width="100%" height="100%" src={url} frameBorder="0" allowvr="yes"
                        allow="vr; xr; accelerometer; magnetometer; gyroscope; autoplay;" allowFullScreen
                        mozallowfullscreen="true" webkitallowfullscreen="true" onmousewheel="" />);
                }
                const params = new URLSearchParams(window.location.search);
                if (params.has('ESCAPP_USER') && params.has('ESCAPP_TOKEN')) {
                    url = url.replace("__ESCAPP_USER__", params.get('ESCAPP_USER'));
                    url = url.replace("__ESCAPP_TOKEN__", params.get('ESCAPP_TOKEN'));
                }
            }
            return (<WebPlugin visor onLoad={(e)=>{e.target.contentWindow.scrollTo(0, state.scrollY);}}
                scrolling={state.fixedPosition ? 'no' : 'yes'} src={url}/>);

        },
    };
}
/* eslint-enable react/prop-types */
