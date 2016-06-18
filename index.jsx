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
    present: {title: "Título Curso", displayMode: "list", navItemsById: {0: {id: 0, children: [], boxes: [], level: 0, type: ''}}}
};
let store = finalCreateStore(GlobalState, initialState);

let root = document.getElementById('root');
ReactDOM.render(
    <Provider>
        <div style={{height: '100%'}}>
            <DaliApp id="app" store={store}/>
        </div>
    </Provider>, root
    );