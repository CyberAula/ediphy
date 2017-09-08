import React from 'react';

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
                        /* onClick={()=>{ this.imageClick();}} */ />
                </div>;
            };
            return <ImageComponent/>;
        }, /*
        imageClick: function(e) {
            alert('Im a magnificent log alert');
        },*/
    };
}
