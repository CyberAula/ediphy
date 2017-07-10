import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import BoxVisor from './BoxVisor';
import BoxSortableVisor from './BoxSortableVisor';
import {Col} from 'react-bootstrap';
import HeaderVisor from './HeaderVisor';
import {isSortableBox} from './../../../utils';

export default class CanvasVisorDoc extends Component {

    render() {
        let titles = [];
        let itemSelected = this.props.fromCV ? this.props.containedViewSelected : this.props.navItemSelected;
        if (itemSelected.id !== 0 && !this.props.fromCV) {
            titles.push(itemSelected.name);
            let parent = itemSelected.parent;
            while (parent !== 0) {
                titles.push(this.props.navItems[parent].name);
                parent = this.props.navItems[parent].parent;
            }
            titles.reverse();
        }

        let maincontent = this.props.fromCV ? document.getElementById('contained_maincontent'):document.getElementById('maincontent');
        let actualHeight;
        if (maincontent) {
            actualHeight = parseInt(maincontent.scrollHeight, 10);
            actualHeight = (parseInt(maincontent.clientHeight, 10) < actualHeight) ? (actualHeight) + 'px' : '100%';
        }

        let overlayHeight = actualHeight ? actualHeight : '100%';
        let boxes = itemSelected.boxes || [];
        return (
            /* jshint ignore:start */

            <Col id={this.props.fromCV ? "containedCanvas":"canvas"} md={12} xs={12}
                 style={{display:'initial', padding: '0', width: '100%'}}>
                 <div className="scrollcontainer">
                 {this.props.fromCV ? ( <a href="#" className="btnOverBar cvBackButton"  style={{pointerEvents: this.props.viewsArray.length > 1 ? 'initial': 'none',  color: this.props.viewsArray.length > 1 ? 'black': 'gray'}} onClick={a => {
                            this.props.removeLastView();
                            a.stopPropagation();
                        }}><i  className="material-icons">undo</i></a>):(<span></span>)}
                     <HeaderVisor titles={titles}
                                  onShowTitle={()=>this.setState({showTitle:true})}
                                  courseTitle={this.props.title}
                                  titleMode={itemSelected.titleMode}
                                  navItem={this.props.navItemSelected}
                                  navItems={this.props.navItems}
                                  containedView={this.props.containedViewSelected}
                                  containedViews={this.props.containedViews}
                                  titleModeToggled={this.props.titleModeToggled}
                                  onUnitNumberChanged={this.props.onUnitNumberChanged}
                                  showButton={true}/>
                <div className="outter canvasvisor">
                    <div id={this.props.fromCV ? 'airlayer_cv':'airlayer'}
                    className={'doc_air'}
                    style={{visibility: (this.props.showCanvas ? 'visible' : 'hidden') }}>

                    <div id={this.props.fromCV ? "contained_maincontent":"maincontent"}
                         onClick={e => {
                        this.setState({showTitle:false})
                       }}
                         className={'innercanvas doc'}
                         style={{visibility: (this.props.showCanvas ? 'visible' : 'hidden')}}>

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

                        {boxes.map(id => {
                            let box = this.props.boxes[id];
                            if (!isSortableBox(box.id)) {
                                return <BoxVisor key={id}
                                                id={id}
                                                boxes={this.props.boxes}
                                                boxSelected={this.props.boxSelected}
                                                boxLevelSelected={this.props.boxLevelSelected}
                                                changeCurrentView={(element)=>{this.props.changeCurrentView(element)}}
                                                containedViewSelected={this.props.containedViewSelected}
                                                toolbars={this.props.toolbars}
                                                richElementsState={this.props.richElementsState}/>
                            } else {
                                return <BoxSortableVisor key={id}
                                                id={id}
                                                boxes={this.props.boxes}
                                                boxSelected={this.props.boxSelected}
                                                boxLevelSelected={this.props.boxLevelSelected}
                                                changeCurrentView={this.props.changeCurrentView}
                                                containedViewSelected={this.props.containedViewSelected}
                                                toolbars={this.props.toolbars}
                                                richElementsState={this.props.richElementsState}/>
                            }
                        })}
                    </div>
                </div>
                </div>
                </div>
            </Col>
            /* jshint ignore:end */
        );
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.boxSelected !== -1) {
            this.setState({showTitle: false});
        }
        if (this.props.navItemSelected.id !== nextProps.navItemSelected.id) {
            document.getElementById(this.props.fromCV ? "contained_maincontent":"maincontent").scrollTop = 0;
        }
    }




}
