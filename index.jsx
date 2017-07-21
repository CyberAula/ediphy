import React from 'react';
import ReactDOM from 'react-dom';

import sortable from 'jquery-ui/ui/widgets/sortable';
import ReduxProvider from './_editor/containers/ReduxProvider';
import i18n from './i18n';

require('es6-promise').polyfill();
require('expose?Dali!./core/temp_hack');
require('./plugins/plugin_dependencies_loader').requireAll();

//Require CSS files
require('./sass/style.scss');

// We make sure JQuery UI Sortable Widget is initialized
new sortable();



/* jshint ignore:start */
ReactDOM.render((<ReduxProvider />), document.getElementById('root'));
/* jshint ignore:end */
