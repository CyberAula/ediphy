import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { isContainedView, isPage, isSection } from '../../../common/utils';
import Config from '../../../core/config';
import * as API from './../../../core/scorm/scorm_utils';

export default class ScormComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            scores: [],
            visited: [],
            exercises: this.props.exercises,
        };
        this.onUnload = this.onUnload.bind(this);
        this.onLoad = this.onLoad.bind(this);
        this.setAnswer = this.setAnswer.bind(this);
        this.submitPage = this.submitPage.bind(this);
    }
    getFirstPage() {
        let navItems = this.props.navItemsIds || [];
        let bookmark = 0;
        for (let i = 0; i < navItems.length; i++) {
            if (Config.sections_have_content ? isSection(navItems[i]) : isPage(navItems[i])) {
                bookmark = navItems[i];
                break;
            }
        }
        return bookmark;
    }
    componentWillReceiveProps(nextProps) {
        if (this.props.currentView !== nextProps.currentView) {
            if(!isContainedView(nextProps.currentView)) {
                API.changeLocation(nextProps.currentView);
            }
            if(!isContainedView(this.props.currentView)) {
                this.savePreviousAndUpdateState();
                API.setFinalScore(this.state.scores, this.state.visited, this.props.globalConfig.trackProgress || false);
            }
        }
    }
    savePreviousAndUpdateState() {
        let score = API.savePreviousResults(this.props.currentView, this.props.navItemsIds, this.props.globalConfig.trackProgress || false);
        let previousScores = Object.assign([], this.state.scores);
        previousScores[score.index] = score.score;
        let previousVisited = Object.assign([], this.state.visited);
        previousVisited[score.index] = score.visited;
        this.setState({ scores: previousScores, visited: previousVisited }); // Careful with this pattern
    }
    render() {
        const { children } = this.props;

        let childrenWithProps = React.Children.map(children, child =>
            React.cloneElement(child, {
                setAnswer: this.setAnswer,
                submitPage: this.submitPage,
                exercises: this.state.exercises[this.props.currentView] }));
        return childrenWithProps;
    }
    componentDidMount() {
        window.addEventListener("load", this.onLoad);
        window.addEventListener("beforeunload", this.onUnload);
    }
    onLoad(event) {
        let init = API.init();
        let bookmark = (init && init.bookmark && init.bookmark !== '') ? init.bookmark : this.getFirstPage();
        this.props.changeCurrentView(bookmark);
        let initState = API.changeInitialState();
        this.setState(initState);
    }

    onUnload(event) {
        if (!isContainedView(this.props.currentView)) {
            this.savePreviousAndUpdateState();
        }
        API.setFinalScore(this.state.scores, this.state.visited, this.props.globalConfig.trackProgress || false);
        API.finish();
    }
    componentWillUnmount() {
        window.removeEventListener("beforeunload", this.onUnload);
        window.removeEventListener("onload", this.onLoad);
    }
    setAnswer(id, answer, page) {
        console.log(answer, id, page, "SET_ANSWER_IN_VISOR");
        let exercises = JSON.parse(JSON.stringify(this.state.exercises));
        console.log();
        if (exercises[page] && exercises[page].exercises[id]) {
            exercises[page].exercises[id].currentAnswer = answer;
            this.setState({ exercises });
        }
    }
    submitPage(page) {
        console.log(page);
    }

}

ScormComponent.propTypes = {

    /**
     * Array que contiene todas las vistas creadas, accesibles por su *id*
     */
    navItemsIds: PropTypes.array.isRequired,
    /**
     * Vista actual
     */
    currentView: PropTypes.any.isRequired,
    /**
     * Configuración global del curso
     */
    globalConfig: PropTypes.object.isRequired,
    /**
     * Cambia la vista actual
     */
    changeCurrentView: PropTypes.func.isRequired,
};
