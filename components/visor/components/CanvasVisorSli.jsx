import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import BoxVisor from './BoxVisor';
import {Col} from 'react-bootstrap';
import TitleVisor from './TitleVisor';
import HeaderVisor from './HeaderVisor';

export default class CanvasVisorSli extends Component {

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
                 style={{display:'initial', padding: '0'}}>

                    <div id="airlayer"
                    className={'slide_air'}
                    style={{margin:'0 auto',visibility: (this.props.showCanvas ? 'visible' : 'hidden') }}>

                    <div id="maincontent"
                         onClick={e => {
                        this.setState({showTitle:false})
                       }}
                         className={'innercanvas sli'}
                         style={{visibility: (this.props.showCanvas ? 'visible' : 'hidden')}}>
                        <HeaderVisor titles={titles}
                                     onShowTitle={()=>this.setState({showTitle:true})}
                                     courseTitle={this.props.title}
                                     titleMode={this.props.navItemSelected.titleMode}
                                     navItem={this.props.navItemSelected}
                                     navItems={this.props.navItems}
                                     titleModeToggled={this.props.titleModeToggled}
                                     onUnitNumberChanged={this.props.onUnitNumberChanged}
                                     showButton={true}/>
                        <TitleVisor titles={titles}
                            courseTitle={this.props.title}
                            titleMode={this.props.navItemSelected.titleMode}
                            navItem={this.props.navItemSelected}
                            navItems={this.props.navItems}/>
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

                            return <BoxVisor key={id}
                                            id={id}
                                            boxes={this.props.boxes}
                                            boxSelected={this.props.boxSelected}
                                            boxLevelSelected={this.props.boxLevelSelected}
                                            changeCurrentView={(element)=>{this.props.changeCurrentView(element)}}
                                            containedViewSelected={this.props.containedViewSelected}
                                            toolbars={this.props.toolbars}
                                            richElementsState={this.props.richElementsState}/>

                        })}
                    </div>
                </div>

            </Col>
            /* jshint ignore:end */
        );
    }
    componentDidMount() {
        this.aspectRatio();
        window.addEventListener("resize", this.aspectRatio);
    }
    componentWillUnmount() {
        window.removeEventListener("resize", this.aspectRatio);
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


}
