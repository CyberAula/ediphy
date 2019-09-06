import React from 'react';
import ReactDOM from 'react-dom';

import sortable from 'jquery-ui/ui/widgets/sortable';
import ReduxProvider from './_editor/containers/ReduxProvider';
// It appears as unused, but it IS used.
// import i18n from './locales/i18n';

require('es6-promise').polyfill();
require('expose-loader?Ediphy!./core/editor/tempHack');
require('./plugins/plugin_dependencies_loader').requireAll();

// Require CSS files
import './sass/style.scss';

// We make sure JQuery UI Sortable Widget is initialized
// eslint-disable-next-line
new sortable();

ReactDOM.render((<ReduxProvider />), document.getElementById('root'));
