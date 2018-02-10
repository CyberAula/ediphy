import React, { Component } from 'react';

import Main from './LandingPageScreens/Main';
import How from './LandingPageScreens/How';
import What from './LandingPageScreens/What';
import When from './LandingPageScreens/When';
import Why from './LandingPageScreens/Why';
import scrollIntoViewIfNeeded from 'scroll-into-view-if-needed';
/* eslint-disable react/prop-types */
export default class Content extends Component {
    render() {
        return (
            [<Main/>, <Why/>, <How/>, <What/>, <When/>,
                <button onClick={this.handleScroll} className="down_arrow" autoFocus>
                    <i className="material-icons">keyboard_arrow_down</i>
                </button>]
        );
    }

    handleScroll() {
        let viewList = ["main", "why", "how", "what", "when"];
        let where = "main";
        let nextInd = 0;
        for (let view in viewList) {
            let element = document.getElementById(viewList[view]);
            let rect = element.getBoundingClientRect();
            if (rect.top >= 0 || rect.bottom > 0) {
                where = viewList[view];
                nextInd = parseInt(view, 10) + 1;
                if (nextInd === viewList.length) {
                    nextInd = 0;
                }
                break;
            }
        }
        let element = document.getElementById(viewList[nextInd]);
        scrollIntoViewIfNeeded(element, { duration: 300, centerIfNeeded: true, easing: 'easeInOut' });

    }
}
/* eslint-enable react/prop-types */
