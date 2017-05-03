import React from "react";

export function HotspotImages(base) {
    return {
        getRenderTemplate: function (state) {
            let template = state.children[0];
            return(<div>
                <img style={{height:"100%",width:"100%"}} src={template.props.src}/>
            </div>);
        }
    };
}
