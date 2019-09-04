import React from 'react';
import Visor3DPlugin from '../components/Visor3DPlugin';

/* eslint-disable react/prop-types */
export function Visor3D() {

    return {
        getRenderTemplate: function(state) {

            return <div className="threeDViewerPlugin" style={{ height: "100%", width: "100%" }}>
                <Visor3DPlugin style={{ width: "100%", height: "100%" }} state={state}/>
            </div>;
        },
    };
}
/* eslint-enable react/prop-types */
