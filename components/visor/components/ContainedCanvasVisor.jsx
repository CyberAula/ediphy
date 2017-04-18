import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import BoxVisor from './BoxVisor';
import BoxSortableVisor from './BoxSortableVisor';
import {Col} from 'react-bootstrap';
import TitleVisor from './TitleVisor';
import HeaderVisor from './HeaderVisor';
import {isSortableBox, isSlide} from './../../../utils';

export default class ContainedCanvasVisor extends Component {

    render() {

        let maincontent = document.getElementById('contained_maincontent');
        let actualHeight;
        if (maincontent) {
            actualHeight = parseInt(maincontent.scrollHeight, 10);
            actualHeight = (parseInt(maincontent.clientHeight, 10) < actualHeight) ? (actualHeight) + 'px' : '100%';
        }

        let overlayHeight = actualHeight ? actualHeight : '100%';
        return (
            /* jshint ignore:start */

            <Col id="containedCanvas" md={12} xs={12}
                 style={{display: this.props.containedViewSelected !== 0 ? 'initial' : 'none' , backgroundColor: 'white'}}>
                 <div className="scrollcontainer">
                <div className="outter canvasvisor">
                    <div id="airlayer"
                    /*className={isSlide(this.props.navItemSelected.type) ? 'slide_air' : 'doc_air'}*/
                    style={{visibility: (this.props.showCanvas ? 'visible' : 'hidden') }}>

                    <div id="contained_maincontent"
                         onClick={e => {
                        this.setState({showTitle:false})
                       }}
                         /*className={isSlide(this.props.navItemSelected.type) ? 'innercanvas sli':'innercanvas doc'}*/
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


                        {(this.props.containedViewSelected !== 0) &&
                            this.props.containedViews[this.props.containedViewSelected].boxes.map(id => {
                            let box = this.props.boxes[id];
                            if (!isSortableBox(box.id)) {
                                return <BoxVisor key={id}
                                                id={id}
                                                boxes={this.props.boxes}
                                                boxSelected={this.props.boxSelected}
                                                boxLevelSelected={this.props.boxLevelSelected}
                                                containedViewSelected={this.props.containedViewSelected}
                                                toolbars={this.props.toolbars}/>
                            } else {
                                return <BoxSortableVisor key={id}
                                                        id={id}
                                                        boxes={this.props.boxes}
                                                        boxSelected={this.props.boxSelected}
                                                        boxLevelSelected={this.props.boxLevelSelected}
                                                        containedViewSelected={this.props.containedViewSelected}
                                                        toolbars={this.props.toolbars}/>
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
            document.getElementById('contained_maincontent').scrollTop = 0;
        }
    }


}
