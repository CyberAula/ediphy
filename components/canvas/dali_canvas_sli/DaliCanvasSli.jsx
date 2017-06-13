import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import DaliBox from '../dali_box/DaliBox';
import DaliShortcuts from '../dali_shortcuts/DaliShortcuts';
import {Col} from 'react-bootstrap';
import DaliTitle from '../dali_title/DaliTitle';
import DaliHeader from '../dali_header/DaliHeader';
import interact from 'interact.js';
import {ADD_BOX} from '../../../actions';
import Dali from './../../../core/main';


export default class DaliCanvasSli extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showTitle: false
        };
    }

    render() {
        let titles = [];
        if (this.props.navItemSelected.id !== 0) {
            titles.push(this.props.navItemSelected.name);
            let parent = this.props.navItemSelected.parent;
            while (parent !== 0) {
                titles.push(this.props.navItems[parent].name);
                parent = this.props.navItems[parent].parent;
            }
            titles.reverse();
        }

        let maincontent = document.getElementById('maincontent');
        let actualHeight;
        if (maincontent) {
            actualHeight = parseInt(maincontent.scrollHeight, 10);
            actualHeight = (parseInt(maincontent.clientHeight, 10) < actualHeight) ? (actualHeight) + 'px' : '100%';
        }

        let overlayHeight = actualHeight ? actualHeight : '100%';
        return (
            /* jshint ignore:start */

            <Col id="canvas" md={12} xs={12}
                 style={{display: this.props.containedViewSelected !== 0 ? 'none' : 'initial'}}>
                 <DaliShortcuts
                     box={this.props.boxes[this.props.boxSelected]}
                     containedViewSelected={this.props.containedViewSelected}
                     isContained={false}
                     onTextEditorToggled={this.props.onTextEditorToggled}
                     onBoxResized={this.props.onBoxResized}
                     onBoxDeleted={this.props.onBoxDeleted}
                     toolbar={this.props.toolbars[this.props.boxSelected]}/>




                    <div id="airlayer"
                    className={'slide_air'}
                    style={{margin: 'auto',visibility: (this.props.showCanvas ? 'visible' : 'hidden') }}>

                    <div id="maincontent"
                         onClick={e => {
                        this.props.onBoxSelected(-1);
                        this.setState({showTitle:false})
                       }}
                         className={'innercanvas sli'}
                         style={{visibility: (this.props.showCanvas ? 'visible' : 'hidden')}}>
                        <DaliHeader titles={titles}
                                    showButtons={this.state.showTitle}
                                    onShowTitle={()=>this.setState({showTitle:true})}
                                    onBoxSelected={this.props.onBoxSelected}
                                    courseTitle={this.props.title}
                                    title={this.props.navItemSelected.name}
                                    navItem={this.props.navItemSelected}
                                    navItems={this.props.navItems}
                                    titleModeToggled={this.props.titleModeToggled}
                                    onUnitNumberChanged={this.props.onUnitNumberChanged}
                                    showButton={true}
                        />
                        <DaliTitle titles={titles}
                            showButtons={this.state.showTitle}
                            onShowTitle={()=>this.setState({showTitle:true})}
                            onBoxSelected={this.props.onBoxSelected}
                            courseTitle={this.props.title}
                            titleMode={this.props.navItemSelected.titleMode}
                            navItem={this.props.navItemSelected}
                            navItems={this.props.navItems}
                            titleModeToggled={this.props.titleModeToggled}
                            onUnitNumberChanged={this.props.onUnitNumberChanged}
                            showButton={true}/>
                        <br/>

                        <div style={{
                                width: "100%",
                                background: "black",
                                height: overlayHeight,
                                position: "absolute",
                                top: 0,
                                opacity: 0.4,
                                display:(this.props.boxLevelSelected > 0) ? "block" : "none",
                                visibility: (this.props.boxLevelSelected > 0) ? "visible" : "collapse"
                            }}></div>

                        {this.props.navItemSelected.boxes.map(id => {
                            let box = this.props.boxes[id];
                            return <DaliBox key={id}
                                            id={id}
                                            boxes={this.props.boxes}
                                            boxSelected={this.props.boxSelected}
                                            boxLevelSelected={this.props.boxLevelSelected}
                                            containedViewSelected={this.props.containedViewSelected}
                                            toolbars={this.props.toolbars}
                                            lastActionDispatched={this.props.lastActionDispatched}
                                            onBoxSelected={this.props.onBoxSelected}
                                            onBoxLevelIncreased={this.props.onBoxLevelIncreased}
                                            onBoxMoved={this.props.onBoxMoved}
                                            onBoxResized={this.props.onBoxResized}
                                            onSortableContainerResized={this.props.onSortableContainerResized}
                                            onBoxesInsideSortableReorder={this.props.onBoxesInsideSortableReorder}
                                            onBoxDropped={this.props.onBoxDropped}
                                            onVerticallyAlignBox={this.props.onVerticallyAlignBox}
                                            onBoxModalToggled={this.props.onBoxModalToggled}
                                            onTextEditorToggled={this.props.onTextEditorToggled}
                            />

                        })}
                    </div>
                </div>


            </Col>
            /* jshint ignore:end */
        );
    }

    componentDidMount() {
        interact(ReactDOM.findDOMNode(this)).dropzone({
            accept: '.floatingDaliBox',
            overlap: 'pointer',
            ondropactivate: function (event) {
                event.target.classList.add('drop-active');
            },
            ondragenter: function (event) {
                event.target.classList.add("drop-target");
            },
            ondragleave: function (event) {
                event.target.classList.remove("drop-target");
            },
            ondrop: function (event) {
                let position = {
                    x: (event.dragEvent.clientX - event.target.getBoundingClientRect().left - document.getElementById('maincontent').offsetLeft)*100/event.target.parentElement.offsetWidth + "%",
                    y: (event.dragEvent.clientY - event.target.getBoundingClientRect().top + document.getElementById('maincontent').scrollTop) + 'px',
                    type: 'absolute'
                };
                let initialParams = {
                    parent: this.props.navItemSelected.id,
                    container: 0,
                    position: position
                };
                Dali.Plugins.get(event.relatedTarget.getAttribute("name")).getConfig().callback(initialParams, ADD_BOX);
                event.dragEvent.stopPropagation();
            }.bind(this),
            ondropdeactivate: function (event) {
                event.target.classList.remove('drop-active');
                event.target.classList.remove("drop-target");
            }
        });

        this.aspectRatio();
        window.addEventListener("resize", this.aspectRatio);
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.aspectRatio);
        interact(ReactDOM.findDOMNode(this)).unset();
    }

    aspectRatio() {
        let canvas = document.getElementById('airlayer');
        canvas.style.height="100%";
        canvas.style.width="100%";
        let ratio;
        /* this is to avoid get values from react flow when using event listeners that do not exist in react
         * get the values from window.object */
        if(window.canvasRatio === undefined){
            ratio = this.props.canvasRatio;
            window.canvasRatio = this.props.canvasRatio; //https://stackoverflow.com/questions/19014250/reactjs-rerender-on-browser-resize
        } else {
            ratio = window.canvasRatio;
        }


        let w = canvas.offsetWidth;
        let h = canvas.offsetHeight;

        if (h < 400 || w < 400){
            canvas.style.height = 0 + "px";
            canvas.style.width = 0 + "px";
        }else if (w > ratio*h) {
            canvas.style.width=(ratio*h)+"px";
            // horizontal centering is done using margin:auto in CSS
        } else if (h > w/ratio) {
            let newHeight = w/ratio;
            canvas.style.height=newHeight +"px";
            // for vertical centering:
            canvas.style.marginTop = (canvas.style.height-newHeight)/2;
        }

    }
    componentWillUpdate(nextProps){
        if (this.props.canvasRatio !== nextProps.canvasRatio){
            window.canvasRatio = nextProps.canvasRatio;
            window.removeEventListener("resize", this.aspectRatio);
            this.aspectRatio();
            window.addEventListener("resize", this.aspectRatio);
        }

    }
}
