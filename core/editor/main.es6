import DevConfig from '../config';
import ProductionConfig from '../config_production';
import NoServerConfig from '../config_noserver';
import { api, api_private } from '../api';
import Plugins from './plugins';
import Visor from '../visor/main';
import Scorm from '../scorm/main';
import i18n from 'i18next';

const Config = process.env.DOC === "doc" ? NoServerConfig :
    process.env.NODE_ENV === "production" ? ProductionConfig : DevConfig;

export default {
    Config: Config,
    API: api(),
    API_Private: api_private(),
    Plugins: Plugins(),
    Visor: Visor,
    Scorm: Scorm,
    i18n: i18n,
};
