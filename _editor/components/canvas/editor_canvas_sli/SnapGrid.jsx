import React from 'react';
export const SnapGrid = ()=> {
    return (<svg width="100%" height="100%" style={{ position: 'absolute', top: 0, zIndex: -1 }} xmlns="http://www.w3.org/2000/svg">
        <defs>
            <pattern id="smallGrid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#ccc" strokeWidth="0.5"/>
            </pattern>
            <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
                <rect width="100" height="100" fill="url(#smallGrid)"/>
                <path d="M 100 0 L 0 0 0 100" fill="none" stroke="#ccc" strokeWidth="1"/>
            </pattern>
        </defs>

        <rect width="100%" height="100%" fill="url(#grid)" />
    </svg>);
};
