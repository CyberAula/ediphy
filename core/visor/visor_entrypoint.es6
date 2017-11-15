import { api, api_private } from '../api';
import Visor from './main';
import Scorm from '../scorm/main';
import Config from '../config';

require('../../sass/style.scss');

// This requires dynamically all scss' kept in component's folders
let scss_context = require.context('../../_editor', true, /\.scss$/);
scss_context.keys().map(scss_context);
let scss_visor_context = require.context('../../_visor', true, /\.scss$/);
scss_visor_context.keys().map(scss_visor_context);

window.ReactDOM = require('react-dom');

window.Dali = {
    API: api(),
    API_Private: api_private(),
    Visor: Visor,
    Scorm: Scorm,
    Config: Config,
};

if (window.State) {
    window.Dali.State = window.State;
    window.State = undefined;
}

if (process.env.DOC !== 'doc' && process.env.NODE_ENV === 'production' && typeof dali_editor_json !== 'undefined') {
    window.Dali.State = JSON.parse(dali_editor_json);
}

Config.pluginList.map(id => {
    try {
        window.Dali.Visor.Plugins.add(id);
    } catch (e) {
    }
});

