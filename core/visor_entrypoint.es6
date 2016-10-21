import {api, api_private} from './api';
import Visor from './visor/main';
import Scorm from './scorm/main';

window.Dali = {
    API: api(),
    API_Private: api_private(),
    Visor: Visor,
    Scorm: Scorm
};

