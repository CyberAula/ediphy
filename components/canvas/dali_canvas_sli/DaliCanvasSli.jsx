import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import DaliBox from '../dali_box/DaliBox';
import DaliShortcuts from '../dali_shortcuts/DaliShortcuts';
import {Col} from 'react-bootstrap';
import DaliTitle from '../dali_title/DaliTitle';
import DaliHeader from '../dali_header/DaliHeader';
import interact from 'interact.js';
import {ADD_BOX} from '../../../actions';
import {aspectRatio} from '../../../common_tools';
import Dali from './../../../core/main';
import ReactResizeDetector from 'react-resize-detector';


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

            <Col id="canvas" md={12} xs={12} className="canvasSliClass"
                 style={{display: this.props.containedViewSelected !== 0 ? 'none' : 'initial'}}>
                


                    <div id="airlayer"
                    className={'slide_air'}
                    style={{margin: 'auto',visibility: (this.props.showCanvas ? 'visible' : 'hidden') }}>

                    <div id="maincontent"
                         ref="slideDropZone"
                         onClick={e => {
                        this.props.onBoxSelected(-1);
                        this.setState({showTitle:false})
                       }}
                         className={'innercanvas sli'}
                         style={{visibility: (this.props.showCanvas ? 'visible' : 'hidden')}}>
                         {/*<svg width="100%" height="100%" style={{position:'absolute', top:0, zIndex: 0}} xmlns="http://www.w3.org/2000/svg">
                           <defs>
                             <pattern id="smallGrid" width="10" height="10" patternUnits="userSpaceOnUse">
                               <path d="M 10 0 L 0 0 0 10" fill="none" stroke="gray" strokeWidth="0.5"/>
                             </pattern>
                             <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
                               <rect width="100" height="100" fill="url(#smallGrid)"/>
                               <path d="M 100 0 L 0 0 0 100" fill="none" stroke="gray" strokeWidth="1"/>
                             </pattern>
                           </defs>

                           <rect width="100%" height="100%" fill="url(#grid)" />
                         </svg>   */}
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
                                            addMarkShortcut={this.props.addMarkShortcut}
                                            boxes={this.props.boxes}
                                            boxSelected={this.props.boxSelected}
                                            boxLevelSelected={this.props.boxLevelSelected}
                                            containedViewSelected={this.props.containedViewSelected}
                                            toolbars={this.props.toolbars}
                                            lastActionDispatched={this.props.lastActionDispatched}
                                            deleteMarkCreator={this.props.deleteMarkCreator}
                                            markCreatorId={this.props.markCreatorId}
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
                    <ReactResizeDetector handleWidth handleHeight onResize={(e)=>{aspectRatio(this.props.canvasRatio)}} />
                </div>
                 <DaliShortcuts
                     box={this.props.boxes[this.props.boxSelected]}
                     containedViewSelected={this.props.containedViewSelected}
                     isContained={false}
                     onTextEditorToggled={this.props.onTextEditorToggled}
                     onBoxResized={this.props.onBoxResized}
                     onBoxDeleted={this.props.onBoxDeleted}
                     onMarkCreatorToggled={this.props.onMarkCreatorToggled}
                     toolbar={this.props.toolbars[this.props.boxSelected]}/>


            </Col>
            /* jshint ignore:end */
        );
    }

    componentDidMount() {
        interact(ReactDOM.findDOMNode(this.refs.slideDropZone)).dropzone({
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
                    x: (event.dragEvent.clientX - event.target.getBoundingClientRect().left - document.getElementById('maincontent').offsetLeft )*100 / document.getElementById('maincontent').offsetWidth + "%",
                    y: (event.dragEvent.clientY - event.target.getBoundingClientRect().top  + document.getElementById('maincontent').scrollTop - parseFloat(document.getElementById('airlayer').style.marginTop)  )*100 / document.getElementById('maincontent').offsetHeight + '%',
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


        aspectRatio(this.props.canvasRatio);
       // window.addEventListener("resize", aspectRatio);
    }

    componentWillUnmount() {
       // window.removeEventListener("resize", aspectRatio);
        interact(ReactDOM.findDOMNode(this)).unset();
    }


    componentWillUpdate(nextProps){
        if (this.props.canvasRatio !== nextProps.canvasRatio){
            window.canvasRatio = nextProps.canvasRatio;
            // window.removeEventListener("resize", aspectRatio);
            aspectRatio(this.props.canvasRatio);
            // window.addEventListener("resize", aspectRatio);
        }

    }
}
