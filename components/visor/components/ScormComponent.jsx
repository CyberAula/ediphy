import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {isContainedView, isPage, isSection} from './../../../utils';
import {aspectRatio} from '../../../common_tools';
import Config from './../../../core/config';
import * as API from './../../../core/scorm/scorm_utils';


export default class ScormComponent extends Component {
    constructor(props) {
        super(props);
    	this.state = {
            scores: [],
            visited:[]
        };
        this.onUnload = this.onUnload.bind(this);
        this.onLoad = this.onLoad.bind(this);
    }
	getFirstPage() {
        var navItems = this.props.navItemsIds || [];
        var bookmark = 0;
        for (var i = 0; i < navItems.length; i++){
            if (Config.sections_have_content ? isSection(navItems[i]):isPage(navItems[i])) {
                bookmark = navItems[i];
                break;
            }
        }
        return bookmark;
    }
    componentWillReceiveProps(nextProps) {
     	if (this.props.currentView !== nextProps.currentView && !isContainedView(this.props.currentView)){
    		this.savePreviousAndUpdateState();
    		API.changeLocation(nextProps.currentView);
    		API.setFinalScore(this.state.scores, this.state.visited, this.props.globalConfig.trackProgress || false);
    	}
    }
    savePreviousAndUpdateState(){
        let score = API.savePreviousResults(this.props.currentView, this.props.navItemsIds, this.props.globalConfig.trackProgress || false);
        let previousScores = Object.assign([],this.state.scores);
        previousScores[score.index] = score.score;
        let previousVisited = Object.assign([],this.state.visited);
        previousVisited[score.index] = score.visited;
        this.setState({scores: previousScores, visited: previousVisited}); //Careful with this pattern
    }
    render() {
    	return null;
    }
    componentDidMount() {
        window.addEventListener("load", this.onLoad);
        window.addEventListener("beforeunload", this.onUnload);
    }
    onLoad(event){
        var init = API.init();
        var bookmark = (init && init.bookmark && init.bookmark !== '') ? init.bookmark : this.getFirstPage();
        this.props.changeCurrentView(bookmark);
        var initState = API.changeInitialState();
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


}