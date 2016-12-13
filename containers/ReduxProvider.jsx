import React, { Component } from 'react';
import { Provider } from 'react-redux';
import DevTools from './DevTools';
import GlobalState from '../reducers/reducers';
import DaliApp from './DaliApp';
import i18n from 'i18next';
import { createStore, compose, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import Dali from './../core/main';

export default class ReduxProvider extends Component {
    constructor(props) {
        super(props);

        this.initialState = {
            present: {
                title: i18n.t('course_title'),
                displayMode: "list",
                navItemsById: {
                    0: {id: 0, children: ["se-1467887497411"], boxes: [], level: 0, type: '', hidden: false},
                    "se-1467887497411": {
                        id: "se-1467887497411",
                        name: i18n.t('section'),
                        isExpanded: true,
                        parent: 0,
                        children: [],
                        unitNumber: 1,
                        hidden: false,
                        boxes: Dali.Config.sections_have_content ? ['bs-1467887497412'] : [],
                        level: 1,
                        type: "",
                        extraFiles: {},
                        titleMode: "expanded"
                    }
                },
                navItemsIds: ['se-1467887497411'],
                navItemSelected: 'se-1467887497411',
                boxesById: Dali.Config.sections_have_content ? {
                    'bs-1467887497412': {
                        id: "bs-1467887497412",
                        parent: "se-1467887497411",
                        container: 0,
                        content: null,
                        type: "sortable",
                        level: -1,
                        col: 0,
                        row: 0,
                        position: {x: 0, y: 0},
                        width: "100%",
                        height: null,
                        text: null,
                        draggable: false,
                        resizable: false,
                        showTextEditor: false,
                        fragment: {},
                        children: [],
                        sortableContainers: {},
                        containedViews: []
                    }
                } : {},
                toolbarsById: Dali.Config.sections_have_content ? {
                    'bs-1467887497412': {
                        id: "bs-1467887497412",
                        state: {},
                        controls: {
                            main: {
                                __name: "Main",
                                accordions: {}
                            }
                        },
                        config: {displayName: i18n.t('Container_')},
                        showTextEditor: false
                    }
                } : {}
            }
        };

        this.store = this.configureStore();
    }

    render() {
        return (
            /* jshint ignore:start */
            <Provider store={this.store}>
                <div style={{height: '100%'}}>
                    <DaliApp id="app" store={this.store}/>
                    {/*<DevTools/>*/}
                </div>
            </Provider>
            /* jshint ignore:end */
        );
    }

    configureStore() {
        const store = createStore(GlobalState, this.initialState, compose(applyMiddleware(thunkMiddleware), DevTools.instrument()));

        if (module.hot) {
            // Enable Webpack hot module replacement for reducers
            module.hot.accept('../reducers/reducers', () => {
                const nextRootReducer = require('../reducers/reducers').default;
                store.replaceReducer(nextRootReducer);
            });
        }

        return store;
    }
}
