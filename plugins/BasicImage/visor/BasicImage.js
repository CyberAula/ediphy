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
                        onError={(e)=>{
                            console.log(e);
                            e.target.onError = null;
                            e.target.src = Dali.Config.broken_link;
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
