import React, { Component } from 'react';
import { Provider } from 'react-redux';
import GlobalState from '../reducers';
import DaliApp from './DaliApp';
import i18n from 'i18next';


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
                        name: i18n.t('section') + " 1",
                        isExpanded: true,
                        parent: 0,
                        children: [],
                        unitNumber: 1,
                        hidden: false,
                        boxes: ['bs-1467887497412'],
                        level: 1,
                        type: "section",
                        position: 1,
                        extraFiles: {},
                        titlesReduced: "expanded"
                    }
                },
                navItemsIds: ['se-1467887497411'],
                navItemSelected: 'se-1467887497411',
                boxes: ['bs-1467887497412'],
                boxesById: {
                    'bs-1467887497412': {
                        id: "bs-1467887497412",
                        parent: "se-1467887497411",
                        container: 0,
                        content: undefined,
                        type: "sortable",
                        level: -1,
                        col: 0,
                        row: 0,
                        position: {x: 0, y: 0},
                        width: "100%",
                        height: undefined,
                        text: null,
                        draggable: false,
                        resizable: false,
                        showTextEditor: false,
                        fragment: {},
                        children: [],
                        sortableContainers: {}
                    }
                },
                toolbarsById: {
                    'bs-1467887497412': {
                        id: "bs-1467887497412",
                        state: undefined,
                        controls: {},
                        config: {name: i18n.t('Container')},
                        showTextEditor: false,
                        isCollapsed: false
                    }
                }
            }
        };
    }

    render() {
        return (
            /* jshint ignore:start */
            <Provider store={this.configureStore()}>
                <div style={{height: '100%'}}>
                    <DaliApp id="app" store={this.configureStore()}/>
                </div>
            </Provider>
            /* jshint ignore:end */
        );
    }

    configureStore() {
        const store = this.props.finalCreateStore(GlobalState, this.initialState);

        if (module.hot) {
            // Enable Webpack hot module replacement for reducers
            module.hot.accept('../reducers', () => {
                const nextRootReducer = require('../reducers').default;
                store.replaceReducer(nextRootReducer);
            });
        }

        return store;
    }
}
