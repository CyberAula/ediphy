import React, {Component} from 'react';
import ReactDOM from 'react-dom';

import CanvasVisor from './components/CanvasVisor';

require('es6-promise').polyfill();
require('./../../sass/style.scss');
require('./../../core/visor_entrypoint');

export default class Visor extends Component {
    render() {

        if(window.State){
            Dali.State = window.State;
        }

        let boxes = Dali.State.boxesById;
        let boxSelected = Dali.State.boxSelected;
        let navItems = Dali.State.navItemsById;
        let navItemSelected = Dali.State.navItemSelected;
        let containedViews = Dali.State.containedViewsById;
        let containedViewSelected = Dali.State.containedViewSelected;
        let toolbars = Dali.State.toolbarsById;
        let title = Dali.State.title;

        return (
            /* jshint ignore:start */
            <CanvasVisor boxes={boxes}
                             boxSelected={boxSelected}
                             navItemSelected={navItems[navItemSelected]}
                             navItems={navItems}
                             containedViews={containedViews}
                             containedViewSelected={containedViewSelected}
                             toolbars={toolbars}
                             title={title}
                             showCanvas={(navItemSelected !== 0)}
            />
            /* jshint ignore:end */
        );
    }
}

/* jshint ignore:start */
ReactDOM.render((<Visor />), document.getElementById('root'));
/* jshint ignore:end */

