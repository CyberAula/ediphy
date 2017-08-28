import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import DaliBox from '../dali_box/DaliBox';
import DaliShortcuts from '../dali_shortcuts/DaliShortcuts';
import Alert from './../../common/alert/Alert';
import { Col, Button } from 'react-bootstrap';
import DaliHeader from '../dali_header/DaliHeader';
import interact from 'interact.js';
import { ADD_BOX } from '../../../../common/actions';
import { isSortableBox } from '../../../../common/utils';
import { aspectRatio } from '../../../../common/common_tools';
import Dali from './../../../../core/main';
import ReactResizeDetector from 'react-resize-detector';
import i18n from 'i18next';

/**
 * DaliCanvasSli component
 * Canvas component to display slides
 */
export default class DaliCanvasSli extends Component {
    /**
     * Constructor
     * @param props
     */
    constructor(props) {
        super(props);
        /**
         * Component's initial state
         * @type {{showTitle: boolean, alert: null}}
         */
        this.state = {
            showTitle: false,
            alert: null,
        };
    }

    /**
     * Renders React component
     * @returns {code}
     */
    render() {
        let itemSelected = this.props.fromCV ? this.props.containedViewSelected : this.props.navItemSelected;
        let titles = [];
        if (itemSelected.id !== 0) {
            titles.push(itemSelected.name);
            if (!this.props.fromCV) {
                let parent = itemSelected.parent;
                while (parent !== 0) {
                    titles.push(this.props.navItems[parent].name);
                    parent = this.props.navItems[parent].parent;
                }
            }
            titles.reverse();
        }

        let maincontent = document.getElementById(this.props.fromCV ? "contained_maincontent" : "maincontent");
        let actualHeight;
        if (maincontent) {
            actualHeight = parseInt(maincontent.scrollHeight, 10);
            actualHeight = (parseInt(maincontent.clientHeight, 10) < actualHeight) ? (actualHeight) + 'px' : '100%';
        }

        let overlayHeight = actualHeight ? actualHeight : '100%';
        let boxes = itemSelected.boxes;
        return (
            /* jshint ignore:start */

            <Col id={this.props.fromCV ? 'containedCanvas' : 'canvas'} md={12} xs={12} className="canvasSliClass"
                style={{ display: this.props.containedViewSelected !== 0 && !this.props.fromCV ? 'none' : 'initial' }}>

                <div id={this.props.fromCV ? 'airlayer_cv' : 'airlayer'}
                    className={'slide_air'}
                    style={{ margin: 'auto', visibility: (this.props.showCanvas ? 'visible' : 'hidden') }}>

                    <div id={this.props.fromCV ? "contained_maincontent" : "maincontent"}
                        ref="slideDropZone"
                        onClick={e => {
                            this.props.onBoxSelected(-1);
                            this.setState({ showTitle: false });
                            e.stopPropagation();
                        }}
                        className={'innercanvas sli'}
                        style={{ visibility: (this.props.showCanvas ? 'visible' : 'hidden') }}>
                        {this.state.alert}
                        {/* <svg width="100%" height="100%" style={{position:'absolute', top:0, zIndex: 0}} xmlns="http://www.w3.org/2000/svg">
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
                            onShowTitle={()=>this.setState({ showTitle: true })}
                            onBoxSelected={this.props.onBoxSelected}
                            courseTitle={this.props.title}
                            title={itemSelected.name}
                            navItem={this.props.navItemSelected}
                            navItems={this.props.navItems}
                            containedView={this.props.containedViewSelected}
                            containedViews={this.props.containedViews}
                            titleModeToggled={this.props.titleModeToggled}
                            onUnitNumberChanged={this.props.onUnitNumberChanged}
                            toolbars={this.props.toolbars}
                            boxes={this.props.boxes}
                            showButton
                        />

                        {/* {this.props.fromCV ?  (<button className="btnOverBar cvBackButton" style={{margin: "10px 0px 0px 10px"}}
                                 onClick={e => {
                                     this.props.onContainedViewSelected(0);
                                     e.stopPropagation();
                                 }}><i className="material-icons">undo</i></button>):(<br/>)}*/}
                        <br/>

                        <div style={{
                            width: "100%",
                            background: "black",
                            height: overlayHeight,
                            position: "absolute",
                            top: 0,
                            opacity: 0.4,
                            display: (this.props.boxLevelSelected > 0) ? "block" : "none",
                            visibility: (this.props.boxLevelSelected > 0) ? "visible" : "collapse",
                        }} />

                        {boxes.map(id => {
                            let box = boxes[id];
                            return <DaliBox key={id}
                                id={id}
                                addMarkShortcut={this.props.addMarkShortcut}
                                boxes={this.props.boxes}
                                boxSelected={this.props.boxSelected}
                                boxLevelSelected={this.props.boxLevelSelected}
                                containedViews={this.props.containedViews}
                                containedViewSelected={this.props.containedViewSelected}
                                toolbars={this.props.toolbars}
                                lastActionDispatched={this.props.lastActionDispatched}
                                deleteMarkCreator={this.props.deleteMarkCreator}
                                markCreatorId={this.props.markCreatorId}
                                onBoxAdded={this.props.onBoxAdded}
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
                                pageType={itemSelected.type || 0}
                            />;

                        })}
                        {/* A JSX comment
                        {boxes.length === 0 ? (<div className="dragContentHere" style={{backgroundColor: 'transparent', border:0}}>{i18n.t("messages.drag_content")}</div>):(<span></span>)}
                        */}
                    </div>
                    <ReactResizeDetector handleWidth handleHeight onResize={(e)=>{aspectRatio(this.props.canvasRatio, this.props.fromCV ? 'airlayer_cv' : 'airlayer', 'canvas');
                    }} />
                </div>
                <DaliShortcuts
                    box={this.props.boxes[this.props.boxSelected]}
                    containedViewSelected={this.props.containedViewSelected}
                    isContained={this.props.fromCV}
                    onTextEditorToggled={this.props.onTextEditorToggled}
                    onBoxResized={this.props.onBoxResized}
                    onBoxDeleted={this.props.onBoxDeleted}
                    pointerEventsCallback={this.props.toolbars[this.props.boxSelected] && this.props.toolbars[this.props.boxSelected].config && this.props.toolbars[this.props.boxSelected].config.name && Dali.Plugins.get(this.props.toolbars[this.props.boxSelected].config.name) ? Dali.Plugins.get(this.props.toolbars[this.props.boxSelected].config.name).pointerEventsCallback : null}
                    onMarkCreatorToggled={this.props.onMarkCreatorToggled}
                    toolbar={this.props.toolbars[this.props.boxSelected]}/>

            </Col>
            /* jshint ignore:end */
        );
    }

    /**
     * After component mounts
     * Set up interact in order to enable dragging boxes
     */
    componentDidMount() {
        interact(ReactDOM.findDOMNode(this.refs.slideDropZone)).dropzone({
            accept: '.floatingDaliBox',
            overlap: 'pointer',
            ondropactivate: function(event) {
                event.target.classList.add('drop-active');
            },
            ondragenter: function(event) {
                event.target.classList.add("drop-target");
            },
            ondragleave: function(event) {
                event.target.classList.remove("drop-target");
            },
            ondrop: function(event) {
                if (Dali.Plugins.get(event.relatedTarget.getAttribute("name")).getConfig().limitToOneInstance) {
                    for (let child in this.props.boxes) {
                        if (!isSortableBox(child) && this.props.boxes[child].parent === this.props.navItemSelected.id && this.props.toolbars[child].config.name === event.relatedTarget.getAttribute("name")) {
                            let alert = (<Alert className="pageModal"
                                show
                                hasHeader
                                backdrop={false}
                                title={ <span><i className="material-icons" style={{ fontSize: '14px', marginRight: '5px' }}>warning</i>{ i18n.t("messages.alert") }</span> }
                                closeButton onClose={()=>{this.setState({ alert: null });}}>
                                <span> {i18n.t('messages.instance_limit')} </span>
                            </Alert>);
                            this.setState({ alert: alert });
                            event.dragEvent.stopPropagation();
                            return;
                        }
                    }
                }
                let mc = this.props.fromCV ? document.getElementById("contained_maincontent") : document.getElementById('maincontent');
                let al = this.props.fromCV ? document.getElementById('airlayer_cv') : document.getElementById('airlayer');
                let position = {
                    x: (event.dragEvent.clientX - event.target.getBoundingClientRect().left - mc.offsetLeft) * 100 / mc.offsetWidth + "%",
                    y: (event.dragEvent.clientY - event.target.getBoundingClientRect().top + mc.scrollTop - parseFloat(al.style.marginTop)) * 100 / mc.offsetHeight + '%',
                    type: 'absolute',
                };
                let initialParams = {
                    parent: this.props.fromCV ? this.props.containedViewSelected.id : this.props.navItemSelected.id,
                    container: 0,
                    position: position,
                };
                Dali.Plugins.get(event.relatedTarget.getAttribute("name")).getConfig().callback(initialParams, ADD_BOX);
                event.dragEvent.stopPropagation();
            }.bind(this),
            ondropdeactivate: function(event) {
                event.target.classList.remove('drop-active');
                event.target.classList.remove("drop-target");
            },
        });

        aspectRatio(this.props.canvasRatio, this.props.fromCV ? 'airlayer_cv' : 'airlayer', 'canvas');
        // window.addEventListener("resize", aspectRatio);
    }

    /**
     * Before component unmounts
     * Unset interact
     */
    componentWillUnmount() {
        // window.removeEventListener("resize", aspectRatio);
        interact(ReactDOM.findDOMNode(this.refs.slideDropZone)).unset();
    }

    /**
     * Before component updates
     * Set aspect ratio acccording to current window size
     * @param nextProps
     */
    componentWillUpdate(nextProps) {
        if (this.props.canvasRatio !== nextProps.canvasRatio) {
            window.canvasRatio = nextProps.canvasRatio;
            // window.removeEventListener("resize", aspectRatio);
            aspectRatio(this.props.canvasRatio, this.props.fromCV ? 'airlayer_cv' : 'airlayer', 'canvas');
            // window.addEventListener("resize", aspectRatio);
        }

    }
}
