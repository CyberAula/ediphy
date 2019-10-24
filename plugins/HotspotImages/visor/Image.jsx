import React from 'react';
import { BasicImage, ImagePluginVisor, Link } from "../Styles";
import { checkHyperlink } from "../../../common/utils";
/* eslint-disable react/prop-types */

export default class Image extends React.Component {
    state = { error: false };
    render() {
        let { state, markElements } = this.props;
        let hyperlink = checkHyperlink(state.hyperlink);
        let scale = state.scale || 1;
        let translateX = (state.translate ? state.translate.x : 0) || 0;
        let translateY = (state.translate ? state.translate.y : 0) || 0;
        let transform = `translate(${translateX}%,${translateY}%) scale(${scale})`;
        let isCustom = state.url.indexOf('templates/template') === -1;

        let errorUrl = (state.url.replace(/ /g, '') === '') ? 'url(/images/placeholder.svg)' : 'url(/images/broken_link.png)';
        let customImage = isCustom ? {
            '--photoUrl': this.state.error ? errorUrl : 'url(' + state.url + ')',
            content: 'var(--photoUrl, url(/images/broken_link.png))',
            objectFit: this.state.error ? 'cover' : undefined } :
            { content: 'var(--' + state.url.replace(/\//g, '_') + ')' };

        return(
            <ImagePluginVisor ref="draggableImageVisor">
                <Link href={hyperlink} target="_blank" hyperlink={hyperlink}>
                    <BasicImage ref="img"
                        style={{ ...customImage, width: state.allowDeformed ? "100%" : "100%", height: state.allowDeformed ? "" : "auto", transform, WebkitTransform: transform, MozTransform: transform }}
                        src={state.url}
                        onError={(e)=>{
                            e.target.onError = null;
                            if(!this.state.error) {
                                this.setState({ error: true });
                            }
                        }}/>
                    {markElements}
                </Link>
            </ImagePluginVisor>);
    }
}
/* eslint-enable react/prop-types */
