import React from 'react';

export function Webpage(base) {
    return {
        getRenderTemplate: function(state) {
            return (<iframe style={{ width: '100%', height: '100%', zIndex: 0 }} src={state.url}/>);

        },
    };
}
