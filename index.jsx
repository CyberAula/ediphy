import React from 'react';
import ReactDOM from 'react-dom';

import sortable from 'jquery-ui/ui/widgets/sortable';
import DevTools from './containers/DevTools';
import ReduxProvider from './containers/ReduxProvider';
import i18n from './i18n';

require('es6-promise').polyfill();
require('expose?Dali!./core/temp_hack');

//Require CSS files
require('./dist/css/textStyles.css');
require('./dist/css/cajascolor.css');
require('./dist/css/jquery-animVert.css');
require('./dist/css/ejercicios.css');
require('./sass/style.scss');

// We make sure JQuery UI Sortable Widget is initialized
new sortable();



/* jshint ignore:start */
ReactDOM.render((<ReduxProvider />), document.getElementById('root'));
/* jshint ignore:end */
