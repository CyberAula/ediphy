import React from 'react';
import { findDOMNode } from 'react-dom';
import ReactPlayer from 'react-player';
import screenfull from 'screenfull';

export default class EnrichedPlayerPlugin extends React.Component {
   constructor(props){
    super(props);
    this.state = {
        volume: 0.8,
        duration: 0,
        played: 0,
        seeking: false,
        fullscreen: false,
        controls: true,
        toBeTriggered: [],
        triggering: false
    };
   }

    componentWillUpdate(nextProps, nextState){
       console.log(nextState);
       console.log(nextProps);
        if(nextState.played !== this.state.played){
            let sudo = this;

            let marks = this.props.state.__marks;
            let triggerMark =  this.props.triggerMark;
            let triggerArray = this.state.toBeTriggered;
            triggerArray.forEach(function(e){
                if ((parseFloat(e.value)/100).toFixed(3) < parseFloat(nextState.played).toFixed(3) ){
                    let toBeTriggered = triggerArray;
                    triggerMark(e.box_id, e.value, true);
                    toBeTriggered.splice(e,1);
                    sudo.setState({toBeTriggered: toBeTriggered});
                }
            });

            Object.keys(marks).forEach(function(key){
                let notInArray = true;

                triggerArray.forEach(function(mark){
                    if(mark === key){
                        notInArray = false;
                    }
                });

                if(notInArray && parseFloat(nextState.played).toFixed(3) <= (parseFloat(marks[key].value)/100).toFixed(3) && parseFloat(parseFloat(nextState.played).toFixed(3)) + 0.1 >= parseFloat((parseFloat(marks[key].value)/100).toFixed(3))){
                    let toBeTriggered = triggerArray;
                    toBeTriggered.push(marks[key]);
                    sudo.setState({toBeTriggered: toBeTriggered});
                }
            });
        }
    }

   componentWillMount(){
       if(this.props.state.currentState !== undefined){
           this.setState({initialPoint: parseFloat(this.props.state.currentState)/100});
       }
   }

   playPause(){
       this.setState({playing: !this.state.playing});
   }

   onClickFullscreen(){
        if(!this.state.fullscreen){
            screenfull.request(findDOMNode(this.player_wrapper));
        } else {
            screenfull.exit();
        }
        this.setState({fullscreen: !this.state.fullscreen});
   }

   setVolume(e){
       this.setState({volume: parseFloat(e.target.value)});
   }

   setPlaybackRate(e){
        console.log(parseFloat(e.target.value));
        this.setState({ playbackRate: parseFloat(e.target.value) });
    }

    onSeekMouseDown(){
        this.setState({ seeking: true });
    }

    onSeekChange(e){
        this.setState({ played: (e.clientX - e.target.getBoundingClientRect().left)/e.target.getBoundingClientRect().width });
    }

    onSeekMouseUp(e){


        if(e.target.className.indexOf('progress-player-input') !== -1){
            this.setState({ seeking: false });
        }
        this.player.seekTo((e.clientX - e.target.getBoundingClientRect().left)/e.target.getBoundingClientRect().width);

    }

    onProgress(state){
        //console.log(state);
        // We only want to update time slider if we are not currently seeking
        if (!this.state.seeking) {
            this.setState(state);
        }

    }

    componentWillReceiveProps(nextProps){
        if(nextProps.state.controls === true && this.state.controls !== this.props.state.controls){
            this.setState({controls:true});
        } else if (nextProps.state.controls === false && this.state.controls !== this.props.state.controls){
            this.setState({controls: false});
        }
    }

    componentDidMount(){
        if(this.player !== undefined && this.state.initialPoint !== undefined){
            this.player.seekTo(this.state.initialPoint);
            this.setState({initialPoint: undefined});
        }
    }

    render(){

        /* jshint ignore:start */
        let marks = this.props.state.__marks;

        let markElements = Object.keys(marks).map((id) =>{
            let value = marks[id].value;

            return(<a key={id} style={{position: 'absolute', left: value, position:"absolute"}} href="#">
                    <div style={{width:"5px", height: "8px", background: "red" }}></div>
                </a>);
        });

        /* jshint ignore:start */
        return (
            <div ref={player_wrapper => {this.player_wrapper = player_wrapper}} style={{width:"100%",height:"100%"}} className="player-wrapper">
                <ReactPlayer
                    ref={player => { this.player = player }}
                    style={{width: "100%", height:"100%"}}
                    height="100%"
                    width="100%"
                    url={this.props.state.url}
                    playing={this.state.playing}
                    volume={this.state.volume}
                    onPlay={() => this.setState({ playing: true })}
                    onPause={() => this.setState({ playing: false })}
                    onEnded={() => this.setState({ playing: false })}
                    onProgress={this.onProgress.bind(this)}
                    onDuration={duration => this.setState({ duration })}
                />
                {(this.state.controls) && (
                    <div className="player-media-controls" style={{opacity:1, pointerEvents: 'all'}}>
                        <button className="play-player-button" onClick={this.playPause.bind(this)}>{this.state.playing ? <i className="material-icons">pause</i> : <i className="material-icons">play_arrow</i>}</button>
                        <div className="progress-player-input dropableRichZone" style={{background: "white", height: "8px", position: "relative"}}
                            // value={this.state.played}
                             onMouseDown={this.onSeekMouseDown.bind(this)}
                             onChange={this.onSeekChange.bind(this)}
                             onMouseUp={this.onSeekMouseUp.bind(this)}
                        >
                            <div className="mainSlider" style={{width:"5px", height: "8px", left: this.state.played*100 +"%", background: "black", position:"absolute" }}></div>
                            {markElements}
                        </div>
                        <input className="volume-player-input " type='range' min={0} max={1} step='any' value={this.state.volume} onChange={this.setVolume.bind(this)} />
                        <button className="fullscreen-player-button" onClick={this.onClickFullscreen.bind(this)}>{(!this.state.fullscreen)?<i className="material-icons">fullscreen</i>:<i className="material-icons">fullscreen_exit</i>}</button>
                    </div>)}
            </div>
        );
        /* jshint ignore:end */
    }
}