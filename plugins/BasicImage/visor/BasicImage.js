import React from 'react';
import img from './../../../dist/images/broken_link.png';

export function BasicImage(base) {
    return {
        init: function() {
            base.registerExtraFunction(this.imageClick, "click");
        },
        getRenderTemplate: function(state) {
            let ImageComponent = () => {
                return <div style={{ width: '100%', height: '100%' }}>
                    <img style={{ width: '100%', height: '100%', left: '0px', top: '0px' }}
                        src={state.url}
                        alt="Default"
                        onError={(e)=>{
                            e.target.onError = null;
                            e.target.src = img;
                        }}
                    />
                </div>;
            };
            return <ImageComponent/>;
        }, /*
        imageClick: function(e) {
            alert('Im a magnificent log alert');
        },*/
    };
}
/* eslint-enable react/prop-types */
