import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { isContainedView, isPage, isSection } from '../../../common/utils';
import Config from '../../../core/config';
import * as API from './../../../core/scorm/scorm_utils';
import GlobalScore from '../scorm/GlobalScore';

export default class ScormComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            exercises: this.props.exercises,
            exerciseNums: API.getExerciseNums(this.props.exercises),
            totalScore: 0,
            userName: "Anonymous",
            isPassed: "incomplete",
        };
        this.onUnload = this.onUnload.bind(this);
        this.onLoad = this.onLoad.bind(this);
        this.setAnswer = this.setAnswer.bind(this);
        this.submitPage = this.submitPage.bind(this);
        this.totalWeight = 0;
        for (let e in this.props.exercises) {
            this.totalWeight += this.props.exercises[e].weight;
        }
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
                if(API.isConnected()) {
                    API.changeLocation(nextProps.currentView);
                }
            }

        }
    }

    render() {
        const { children } = this.props;
        let scoreInfo = { userName: this.state.userName, totalScore: this.state.totalScore, totalWeight: this.totalWeight, isPassed: this.state.isPassed };
        let childrenWithProps = React.Children.map(children, child =>
            React.cloneElement(child, {
                setAnswer: this.setAnswer,
                submitPage: this.submitPage,
                exercises: this.state.exercises[this.props.currentView] }));
        return [...childrenWithProps, this.props.globalConfig.hideGlobalScore ? null : <GlobalScore scoreInfo={scoreInfo}/>];

    }
    componentDidMount() {
        window.addEventListener("load", this.onLoad);
        window.addEventListener("beforeunload", this.onUnload);
    }
    onLoad(event) {
        let scorm = new API.init(true, true);
        if(!API.isConnected()) {
            return;
        }
        let init = API.getInitialState();
        if (init /* && this.props.fromScorm*/) {
            let bookmark = (init && init.bookmark && init.bookmark !== '') ? init.bookmark : this.getFirstPage();
            this.props.changeCurrentView(bookmark);
            let initState = API.changeInitialState(this.state.exercises, this.state.exerciseNums);
            initState.totalScore = init.totalScore;
            initState.userName = init.userName;
            initState.isPassed = init.isPassed;
            initState.currentStatus = init.currentStatus;
            initState.currentStatus = init.currentStatus;
            this.setState(initState);
        }
    }

    onUnload(event) {
        if(API.isConnected()) {
            API.finish();
        }
    }
    componentWillUnmount() {
        window.removeEventListener("beforeunload", this.onUnload);
        window.removeEventListener("onload", this.onLoad);
    }
    setAnswer(id, answer, page) {
        let exercises = JSON.parse(JSON.stringify(this.state.exercises));
        if (exercises[page] && exercises[page].exercises[id]) {
            exercises[page].exercises[id].currentAnswer = answer;
            this.setState({ exercises });
        }
    }
    submitPage(page) {
        let exercises = JSON.parse(JSON.stringify(this.state.exercises));
        let total = 0;
        let points = 0;
        let bx = exercises[page].exercises;
        for (let ex in bx) {
            total += bx[ex].weight;
            bx[ex].score = 0;
            let plug = Ediphy.Visor.Plugins.get(bx[ex].name);
            if (plug.checkAnswer(bx[ex].currentAnswer, bx[ex].correctAnswer)) {
                points += bx[ex].weight;
                bx[ex].score = bx[ex].weight;

            }
            if(API.isConnected()) {
                API.setExerciseScore(bx[ex].num, bx[ex].score, bx[ex].currentAnswer);
            }
            bx[ex].attempted = true;
        }

        exercises[page].attempted = true;
        let pageScore = points / total;
        exercises[page].score = parseFloat(pageScore.toFixed(2));
        console.log(this.state.totalScore, pageScore, exercises[page].weight, typeof(this.state.totalScore), typeof(pageScore), typeof(exercises[page].weight));
        let totalScore = parseFloat((this.state.totalScore + pageScore * exercises[page].weight).toFixed(2));
        this.setState({ exercises, totalScore });
        let visitedPctg = 0;
        for (let p in exercises) {
            if (exercises[p].attempted) {
                visitedPctg += 1;
            }
        }
        visitedPctg = visitedPctg / Object.keys(exercises).length;
        if(API.isConnected()) {
            API.setSCORMScore(totalScore, this.totalWeight, visitedPctg);
        }
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
    /**
      * Children components
     */
    children: PropTypes.object,
    /**
     * Whether the app is in SCORM mode or not
     */
    fromScorm: PropTypes.bool,
    /**
       * Object containing all the exercises in the course
       */
    exercises: PropTypes.object.isRequired,
};
