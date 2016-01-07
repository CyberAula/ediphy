import React from 'react';
import ReactDOM from 'react-dom';
import {createStore} from 'redux';
import {Provider} from 'react-redux';
import DaliApp from './containers/DaliApp';
import GlobalState from './reducers';

let initialState = {
    present: {navItemsById: {0: {id: 0, children: [], level: 0, type: ''}}}
};
let store = createStore(GlobalState, initialState);

let root = document.getElementById('root');
ReactDOM.render(
    <Provider store={store}>
        <DaliApp />
    </Provider>, root
    );