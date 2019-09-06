import Visor from './main';
import Scorm from '../scorm/main';
import Config from '../config';
import i18n from './../../locales/i18n';
import { serialize } from '../../reducers/serializer';

require('../../sass/style.scss');

// This requires dynamically all scss-files' kept in component's folders
let scss_context = require.context('../../_editor', true, /\.scss$/);
scss_context.keys().map(scss_context);
let scss_visor_context = require.context('../../_visor', true, /\.scss$/);
scss_visor_context.keys().map(scss_visor_context);

window.ReactDOM = require('react-dom');

window.Ediphy = {
    Visor: Visor,
    Scorm: Scorm,
    Config: Config,
    i18n: i18n,
};

if (window.State) {
    window.Ediphy.State = window.State;
    window.State = undefined;
}

if (process.env.DOC !== 'doc' && process.env.NODE_ENV === 'production' && typeof ediphy_editor_json !== 'undefined') {
    window.Ediphy.State = serialize({ "present": { ...JSON.parse(ediphy_editor_json) } }).present;
}

Config.pluginList.map(id => {
    try {
        window.Ediphy.Visor.Plugins.add(id);
    } catch (e) {
    }
});

