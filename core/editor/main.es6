import DevConfig from '../config';
import ProductionConfig from '../config_production';
import NoServerConfig from '../config_noserver';
import { api, api_private } from '../api';
import { initialState } from '../store/state';
// import { emptyState } from '../store/state.empty';
// import { markState } from '../store/state.marks';
import Plugins from './plugins';
import Visor from '../visor/main';
import Scorm from '../scorm/main';
import i18n from './../../locales/i18n';

const Config = process.env.DOC === "doc" ? NoServerConfig :
    process.env.NODE_ENV === "production" ? ProductionConfig : DevConfig;

let InitialState = (config) => { return process.env.DOC === "doc" ? initialState(config) :
    process.env.NODE_ENV === "production" ? initialState(config) : initialState(config);
};

export default {
    Config: Config,
    API: api(),
    API_Private: api_private(),
    Plugins: Plugins(),
    Visor: Visor,
    Scorm: Scorm,
    i18n: i18n,
    InitialState: InitialState(Config),
};
