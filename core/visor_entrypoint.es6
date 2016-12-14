import {api, api_private} from './api';
import Visor from './visor/main';
import Scorm from './scorm/main';
import Config from './config';

require('../dist/css/textStyles.css');
require('../dist/css/cajascolor.css');
require('../dist/css/jquery-animVert.css');
require('../dist/css/ejercicios.css');
require('../sass/style.scss');

// This requires dynamically all scss' kept in component's folders
var scss_context = require.context('../components', true, /\.scss$/);
scss_context.keys().map(scss_context);

window.ReactDOM = require('react-dom');

window.Dali = {
    API: api(),
    API_Private: api_private(),
    Visor: Visor,
    Scorm: Scorm
};

Config.pluginList.map(id => {
    try {
        window.Dali.Visor.Plugins.add(id);
    } catch (e) {
    }
});

