import React from 'react';

export function BasicImage(base) {
    return {
        init: function() {
            base.registerExtraFunction(this.imageClick, "click");
        },
        getRenderTemplate: function(state) {
            return <div style={{ width: '100%', height: '100%' }}>
                <img className="basicImageClass"
                    style={{ width: '100%', height: '100%', left: '0px', top: '0px' }}
                    src={state.url}
                    onClick={()=>{$dali$.imageClick();}} />
            </div>;

        },
        imageClick: function(e) {
            alert('Im a magnificent log alert');
        },
    };
}
