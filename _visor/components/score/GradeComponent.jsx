import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { isContainedView, isPage, isSection } from '../../../common/utils';
import Config from '../../../core/config';
import * as API from './../../../core/scorm/SCORM_WRAPPER';
import GlobalScore from './GlobalScore';

export default class ScormComponent extends Component {
    constructor(props) {
        super(props);
        let { exNums, exercises, pages } = API.getExerciseNumsAndAnswers(this.props.exercises);
        this.state = {
            exercises: this.props.exercises,
            totalScore: 0,
            completionProgress: 0,
            userName: "Anonymous",
            isPassed: "incomplete",
            suspendData: { exercises, pages },
        };
        this.totalWeight = 0;
        for (let e in this.props.exercises) {
            this.totalWeight += this.props.exercises[e].weight;
        }
        this.exerciseNums = exNums;
        this.numPages = Object.keys(this.props.exercises).length;
        this.timer = this.props.globalConfig.minTimeProgress;
        if (this.timer && !isNaN(this.timer)) {
            if (this.timer < 1) {
                this.timer = 1;
            } else if (this.timer > 500) {
                this.timer = 500;
            }
        } else {
            this.timer = 3;
        }
        this.timer *= 1000;
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
    UNSAFE_componentWillReceiveProps(nextProps) {
        if (this.props.currentView !== nextProps.currentView) {
            setTimeout(()=>{
                if (this.props.currentView === nextProps.currentView) {
                    this.timeProgress();
                }

            }, this.timer);
            if(API.isConnected()) {

                if(!isContainedView(nextProps.currentView)) {
                    API.changeLocation(nextProps.currentView);
                }
            }
        }
    }

    render() {
        const { children, globalConfig } = this.props;

        let scoreInfo = { userName: this.state.userName, totalScore: this.state.totalScore, totalWeight: this.totalWeight, isPassed: this.state.isPassed, completionProgress: this.state.completionProgress };
        let childrenWithProps = React.Children.map(children, (child, i) =>
            React.cloneElement(child, {
                key: i,
                setAnswer: this.setAnswer,
                submitPage: this.submitPage,
                exercises: this.state.exercises }));
        return [...childrenWithProps, this.props.globalConfig.hideGlobalScore ? null : null,
            <GlobalScore key="-1"
                scoreInfo={scoreInfo}
                fadePlayerClass={this.props.fadePlayerClass}
                setHover={this.props.setHover}
                deleteHover = {this.props.deleteHover}
                show={!globalConfig.hideGlobalScore && !globalConfig.visorNav.sidebar}/>,
        ];

    }
    componentDidMount() {
        window.addEventListener("load", this.onLoad);
        window.addEventListener("beforeunload", this.onUnload);
    }
    onLoad = (event) => {
        let DEBUG = Ediphy.Config.debug_scorm;
        let scorm = new API.init(DEBUG, DEBUG);

        if(API.isConnected()) {
            let init = API.getInitialState(this.state.exercises, this.exerciseNums, this.numPages, this.state.suspendData);
            let isFirst = false;
            if (init) {
                let bookmark = (init && init.bookmark && init.bookmark !== '') ? init.bookmark : this.getFirstPage();
                this.props.changeCurrentView(bookmark);
                this.setState(init);
                if (init.userName) {
                    window.user = init.userName;
                }
                isFirst = this.props.currentView === bookmark;
                if (!isFirst) {
                    return;
                }

            }
        }
        let scoreInfo = { userName: this.state.userName, totalScore: this.state.totalScore, totalWeight: this.totalWeight, completionProgress: this.state.completionProgress, visited: this.state.suspendData.pages };
        this.props.updateScore(scoreInfo);
        setTimeout(()=>{
            this.timeProgress();
        }, this.timer);
    };

    timeProgress = () => {
        let currentView = this.props.currentView;
        let exercises = JSON.parse(JSON.stringify(this.state.exercises));
        if (!this.state.exercises[currentView].visited && Object.keys(exercises[currentView].exercises).length === 0) {

            exercises[currentView].visited = true;

            let suspendData = JSON.parse(JSON.stringify(this.state.suspendData));
            let ind = Object.keys(this.state.exercises).indexOf(this.props.currentView);
            suspendData.pages[ind] = true;
            let completionProgress = this.calculateVisitPctg(suspendData.pages);
            let totalScore = parseFloat(this.state.totalScore);
            // If we remove the next comments and instead comment the general if, we will track progress of the scorable pages separately from the exercises
            // if (!this.state.exercises[currentView].visited && Object.keys(exercises[currentView].exercises).length === 0) {
            exercises[currentView].attempted = true;
            totalScore += exercises[currentView].weight;
            // }

            this.setState({ totalScore, suspendData, exercises, completionProgress });

            if (API.isConnected()) {
                API.setSCORMScore(totalScore, this.totalWeight, completionProgress, suspendData);

            }
            let scoreInfo = { userName: this.state.userName, totalScore, totalWeight: this.totalWeight, completionProgress, visited: suspendData.pages };
            this.props.updateScore(scoreInfo);
        }

    };

    onUnload = (event) => {
        if(API.isConnected()) {
            API.finish();
        }
    };

    componentWillUnmount() {
        window.removeEventListener("beforeunload", this.onUnload);
        window.removeEventListener("onload", this.onLoad);
    }
    setAnswer = (id, answer, page) => {
        let exercises = JSON.parse(JSON.stringify(this.state.exercises));
        if (exercises[page] && exercises[page].exercises[id] && !exercises[page].attempted) {
            exercises[page].exercises[id].currentAnswer = answer;
            this.setState({ exercises });
        }
    };

    submitPage = (page) => {
        let exercises = JSON.parse(JSON.stringify(this.state.exercises));
        let suspendData = JSON.parse(JSON.stringify(this.state.suspendData));
        let bx = exercises[page].exercises;
        // Peso de los ejercicios. Si todos valen cero se añadira peso 1 por ejercicio.
        let total = 0;
        // Puntuación de todos los ejs (los que tienen peso 0 asume peso 1)
        let points = 0;
        // Puntuación de solo los ejs que cuentan para nota
        let pointsNoWeight = 0;
        // Numero de ejercicios sin peso
        let noWeight = 0;

        for (let ex in bx) {
            // Añado el peso del ejercicio
            total += bx[ex].weight;
            // Si el ejercicio no tiene peso, lo contabilizo
            noWeight = (bx[ex].weight === 0) ? (noWeight + 1) : noWeight;
            // Pongo a cero la puntuación del ejercicio
            bx[ex].score = 0;

            let plug = Ediphy.Visor.Plugins.get(bx[ex].name);
            let toolbar = this.props.pluginToolbars[ex];
            let checkAnswer = plug.checkAnswer(bx[ex].currentAnswer, bx[ex].correctAnswer, toolbar.state);
            if (checkAnswer) {
                // La puntuación máxima del ejercicio será su peso
                let exScore = bx[ex].weight;
                try {
                    if(!isNaN(parseFloat(checkAnswer))) {
                        // Si el peso del ejercicio es 0, simulo 1 al calcular su nota
                        exScore = exScore === 0 ? checkAnswer : exScore * checkAnswer;
                    }

                } catch(e) {}
                // Sumo la nota obtenida en el ejercicio
                points += exScore;
                // Si el ejercicio cuenta para nota, contabilizo su nota
                pointsNoWeight += (bx[ex].weight === 0) ? 0 : exScore;
                // Pongo como nota del ejercicio la calculada
                bx[ex].score = exScore;

            }
            bx[ex].attempted = true;
            suspendData.exercises[bx[ex].num - 1] = {
                a: bx[ex].currentAnswer,
                s: bx[ex].score,
                c: bx[ex].attempted ? "completed" : "incomplete" };

        }
        // Peso total. Si ningun ejercicio cuenta para nota es el numero de ejs
        let noCountingExercises = (total === 0);
        total = (noCountingExercises) ? noWeight : total;
        points = (noCountingExercises) ? points : pointsNoWeight;

        let pageScore = points / total;

        let ind = Object.keys(this.state.exercises).indexOf(this.props.currentView);
        suspendData.pages[ind] = true;

        exercises[page].attempted = true;
        exercises[page].visited = true;
        exercises[page].score = parseFloat(pageScore.toFixed(2));

        // Calculo el peso proporcional a añadir de la pagina (si ningun ejercicio cuenta para nota, añado full weight)
        let toAdd = parseFloat((noCountingExercises) ? exercises[page].weight : pageScore * exercises[page].weight);
        let totalScore = parseFloat((parseFloat(parseFloat(this.state.totalScore) + toAdd)).toFixed(2));
        let completionProgress = this.calculateVisitPctg(suspendData.pages);
        this.setState({ exercises, totalScore, suspendData, completionProgress });
        if(API.isConnected()) {
            API.setSCORMScore(totalScore, this.totalWeight, completionProgress, suspendData);
        }
        let scoreInfo = { userName: this.state.userName, totalScore, totalWeight: this.totalWeight, completionProgress, visited: suspendData.pages };
        this.props.updateScore(scoreInfo);
    };

    calculateVisitPctg(pages) {
        let visitedPctg = 0;
        visitedPctg = pages.reduce((old, act)=>{
            return old + (act ? 1 : 0);
        });
        visitedPctg = visitedPctg / (pages.length || 1);
        return visitedPctg;
    }

}

ScormComponent.propTypes = {

    /**
     * Objects Array that contains all created views (identified by its *id*)
     */
    navItemsIds: PropTypes.array.isRequired,
    /**
     * Current view
     */
    currentView: PropTypes.any.isRequired,
    /**
     * Course's global configuration
     */
    globalConfig: PropTypes.object.isRequired,
    /**
     * Change current view
     */
    changeCurrentView: PropTypes.func.isRequired,
    /**
     * Children components
     */
    children: PropTypes.object,
    // /**
    //  * Whether the app is in SCORM mode or not
    //  */
    // fromScorm: PropTypes.bool,
    /**
     * Object containing all the exercises in the course
     */
    exercises: PropTypes.object.isRequired,
    /**
     * Inform the rest of the application of the SCORM Information
     * */
    updateScore: PropTypes.func.isRequired,
    /**
    * Boxes toolbars
    */
    pluginToolbars: PropTypes.object,
    /**
     * CSS class used to hide player when mouse stops moving
     */
    fadePlayerClass: PropTypes.string,
    /**
     * Function that allows to add the hover class to the player and the arrow tab
     */
    setHover: PropTypes.func,
    /**
     * Function that allows to delete the hover class in he player and the arrow tab
     */
    deleteHover: PropTypes.func,
};
