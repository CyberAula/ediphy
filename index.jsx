import React from 'react';
import {createStore} from 'redux';
import {Provider} from 'react-redux';
import DaliApp from './containers/DaliApp';
import GlobalState from './reducers';

let initialState = {
    slideSelected: 0,
    slides: [0],
    slidesById: {0: {boxes: []}}
};
let store = createStore(GlobalState);

let root = document.getElementById('root');
React.render(
    <Provider store={store}>
        {() => <DaliApp />}
    </Provider>, root
    );