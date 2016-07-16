import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, compose, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk'
import {Provider} from 'react-redux';
import DaliApp from './containers/DaliApp';
import DevTools from './containers/DevTools';
import GlobalState from './reducers';

const finalCreateStore = compose(applyMiddleware(thunkMiddleware), DevTools.instrument())(createStore);

let initialState = {
    present: {
    	title: "Título Curso", 
	    displayMode: "list", 
	    navItemsById: {
	    	0: {id: 0, children: ["se-1467887497411"], boxes: [], level: 0, type: ''}, 
	    	"se-1467887497411": { id: "se-1467887497411", name: "Section 1", isExpanded: true, parent: 0, children: [], boxes: ['bs-1467887497412'], level: 1, type: "section", position: 1, titlesReduced: "expanded" }
	    }, 
	    navItemsIds:['se-1467887497411'],
	    navItemSelected: 'se-1467887497411',
	    boxes: ['bs-1467887497412'],
	    boxesById:{
	    	'bs-1467887497412': { id: "bs-1467887497412", parent: "se-1467887497411", container: 0, content: undefined, type: "sortable", level: -1, col: 0, row: 0, position: {x:0, y:0}, width: "100%", height: undefined, text: null, draggable: false, resizable: false, showTextEditor: false, fragment:{}, children: [], sortableContainers:{} }
	    },
 	    toolbarsById:{
	    	'bs-1467887497412': {id: "bs-1467887497412", state: undefined, controls: {}, config: {name: "Contenedor"}, showTextEditor: false, isCollapsed: false}
	    }
 	}
};
let store = finalCreateStore(GlobalState, initialState);

let root = document.getElementById('root');
ReactDOM.render(
    <Provider store={store}>
        <div style={{height: '100%'}}>
            <DaliApp id="app" store={store}/>
        </div>
    </Provider>, root
    );