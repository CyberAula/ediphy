import {api, api_private} from './api';
import Visor from './visor/main';
import Scorm from './scorm/main';
import Config from './config';

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

