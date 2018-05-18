import React from 'react';
import Visor3DPluginEditor from '../components/Visor3DPluginEditor';

/* eslint-disable react/prop-types */
export function Visor3D(base) {

    return {
        getRenderTemplate: function(state, props) {

            return <div className="3DViewerPlugin" style={{ height: "100%", width: "100%" }}>
                <Visor3DPluginEditor style={{ width: "100%", height: "100%" }} state={state}/>
            </div>;
        },
    };
}
/* eslint-enable react/prop-types */

