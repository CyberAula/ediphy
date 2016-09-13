import React from 'react';
import ReactDOM from 'react-dom';
import { I18nextProvider } from 'react-i18next';
import { createStore, compose, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import sortable from 'jquery-ui/ui/widgets/sortable';
import DevTools from './containers/DevTools';
import ReduxProvider from './containers/ReduxProvider';
//https://github.com/i18next/react-i18next
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

const finalCreateStore = compose(applyMiddleware(thunkMiddleware), DevTools.instrument())(createStore);

/* jshint ignore:start */
ReactDOM.render((<I18nextProvider i18n={ i18n }><ReduxProvider finalCreateStore={finalCreateStore}/></I18nextProvider>), document.getElementById('root'));
/* jshint ignore:end */
