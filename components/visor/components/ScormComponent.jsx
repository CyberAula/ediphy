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
            scores: []
        };    
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
     	if (this.props.currentView !== nextProps.currentView){
            if(!isContainedView(this.props.currentView)){
        		let score = API.savePreviousResults(this.props.currentView, this.props.navItemsIds);
        		let previous = Object.assign([],this.state.scores);
        		previous[score.index] = score.score;
        		this.setState({scores: previous}); //Careful with this pattern
            }
    		API.setFinalScore(this.state.scores);
            if (!isContainedView(nextProps.currentView)){
              API.changeLocation(nextProps.currentView); 
            }
    	}
    }

    render() {
    	return null;
    }

    componentDidMount() {
        window.addEventListener("onSCORM", function scormFunction(event){
            var init = API.init();
            var bookmark = (init && init.bookmark && init.bookmark !== '') ? init.bookmark : this.getFirstPage();
            this.props.changeCurrentView(bookmark);
            var scores = API.changeInitialScores();
            this.setState({scores: scores});
        }.bind(this));

        window.addEventListener("offSCORM", function offScorm(event){
        	API.setFinalScore(this.state.scores);
            API.finish();
        });
    }

    
}