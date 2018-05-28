// This file contains the boilerplate to execute your React app.
// If you want to modify your application's content, start in "index.js"

import { ReactInstance } from 'react-360-web';
import ConexionModule from './ConexionModule';

function init(bundle, parent, options = {}) {
    const r360 = new ReactInstance(bundle, parent, {
    // Add custom options here
        fullScreen: true,
        nativeModules: [
            ctx => new ConexionModule(ctx),
        ],
        ...options,
    });

    // Render your app content to the default cylinder surface
    r360.renderToSurface(
        r360.createRoot('Ediphy360', { /* initial props */ }),
        r360.getDefaultSurface()
    );

    // Load the initial environment
    r360.compositor.setBackground(r360.getAssetURL('pano-planets.jpg'));
}

window.React360 = { init };
