import Ediphy from '../../core/editor/main';

export default function version(state = "3", action = {}) {
    return Ediphy.Config.version;
}
