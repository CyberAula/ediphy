import React, {Component} from 'react';
import {Modal, Button, Tabs, Tab, Col} from 'react-bootstrap';
import interact from 'interact.js';
import Dali from './../../../core/main';
import {isSortableBox, isSlide} from './../../../utils';
import ReactDOM from 'react-dom';

require('./_pluginRibbon.scss');

export default class PluginRibbon extends Component {
    constructor(props) {
        super(props);
        this.state = {
            buttons: []
        };
    }

    render() {
        return (
            /* jshint ignore:start */
            <Col id="ribbon"
                 md={12}
                 xs={12}
                 style={{
                     height: this.props.ribbonHeight,
                     overflowY:'hidden'
                 }} ref="holder">
                <div id="insideribbon" className="row">
                    <div id="ribbonList">
                        {this.state.buttons.map((item, index) => {
                            let button = this.state.buttons[index];
                            if (button.category === this.props.category || this.props.category == 'all') {
                                var clase = "" + button.icon;
                                return (<div key={index} className="buttonPlace">
                                    <Button className={"rib " + (button.allowFloatingBox ? "floatingDaliBox" : "")}
                                            disabled={this.props.disabled}
                                            key={index}
                                            name={item.name}
                                            bsSize="large"
                                            draggable="false"
                                            style={(button.iconFromUrl) ? {
                                                padding: '8px 8px 8px 45px',
                                                backgroundImage: 'url('+ clase +')',
                                                backgroundSize: '32px',
                                                backgroundPosition: '8px',
                                                backgroundRepeat: 'no-repeat'
                                            }:{}
                                            }>
                                        <i className="material-icons" style={(button.iconFromUrl)?{display:'none'}:{}}>{clase}</i> {button.displayName}
                                    </Button>
                                </div>);
                            }
                        })}
                    </div>
                </div>

            </Col>
            /* jshint ignore:end */
        );
    }
    handleScroll(e) {
        var element = this.props.containedViewSelected !== 0 ? document.getElementById("containedCanvas") : document.getElementById("canvas");
        if (e.deltaY > 0){ //scroll-down
            element.scrollTop = element.scrollTop + 20;
        }else{ //scroll-up
            element.scrollTop = element.scrollTop - 20;
        }
    }
    componentWillUnmount() {
        const holder = ReactDOM.findDOMNode(this.refs.holder);
        holder.removeEventListener('mousewheel', this.handleScroll);
    }

    componentWillUpdate(nextProps,nextState){
        //unset interactable and put it back with autoscroll false this is mandatory when changing between containecanvas and canvas
        let container;

        if(this.props.containedViewSelected !== nextProps.containedViewSelected){
            if(nextProps.containedViewSelected !== 0) {
                container = "containedCanvas";
            }
        }else{
                container = "canvas";
        }

        // !isSlide(this.props.navItemSelected) && isSlide(nextProps.navitemselected) -> Aplicar interact para slide
        // isSlide(this.props.navItemSelected) && !isSlide(nextProps.navitemselected) -> Aplicar interact para doc

        interact(".rib").unset();
        interact(".rib")
            .draggable({
                inertia: true,
                autoScroll: {
                    container: document.getElementById(container),
                    margin: 50,
                    speed: 400,
                    distance: 0,
                    interval: 0
                },
                onstart: function (event) {
                    changeOverflow(true);
                    let original = event.target;
                    let parent = original.parentNode;
                    let dw = original.offsetWidth;
                    let clone = original.cloneNode(true),
                        x = (parseFloat(original.getAttribute('data-x') - dw, 10) || 0),
                        y = (parseFloat(original.getAttribute('data-y'), 10) || 0);
                    clone.setAttribute("id", "clone");
                    clone.setAttribute('data-x', x);
                    clone.setAttribute('data-y', y);
                    parent.appendChild(clone);
                    // translate the element
                    clone.style.webkitTransform =
                        clone.style.transform =
                            'translate(' + (x) + 'px, ' + (y) + 'px)';
                    clone.style.position = 'absolute';
                },
                onmove: (event) => {
                    let target = document.getElementById('clone'),
                        // keep the dragged position in the data-x/data-y attributes

                        x = (parseFloat(target.getAttribute('data-x'), 10) || 0) + event.dx,
                        y = (parseFloat(target.getAttribute('data-y'), 10) || 0) + event.dy;

                    // translate the element
                    target.style.webkitTransform =
                        target.style.transform =
                            'translate(' + (x) + 'px, ' + (y) + 'px)';
                    target.style.zIndex = '9999';

                    target.classList.add('ribdrag');

                    // update the position attributes
                    target.setAttribute('data-x', x);
                    target.setAttribute('data-y', y);

                    //console.log(y);
                },
                onend: (event) => {
                    changeOverflow(false);
                    let original = event.target;
                    let parent = original.parentNode;
                    let dw = original.offsetWidth;
                    let clone = document.getElementById('clone');


                    var target = clone,
                        x = 0,
                        y = 0;
                    target.style.webkitTransform =
                        target.style.transform =
                            'translate(' + (x) + 'px, ' + y + 'px)';

                    target.style.zIndex = '9999';
                    target.style.position = 'relative';
                    target.classList.remove('ribdrag');

                    target.setAttribute('data-x', x);
                    target.setAttribute('data-y', y);

                    parent.removeChild(clone);
                    event.stopPropagation();
                }
            });

    }

    componentDidMount() {
        Dali.API_Private.listenEmission(Dali.API_Private.events.addMenuButtons, e => {
            this.setState({buttons: this.state.buttons.concat(e.detail)});
        });

        const holder = ReactDOM.findDOMNode(this.refs.holder);
        holder.addEventListener('mousewheel', this.handleScroll);

        let container;


            if(this.props.containedViewSelected !== 0) {
                container = "containedCanvas";

        }else{

                container = "canvas";

        }
        let elContainer = document.getElementById(container);
        interact.dynamicDrop(true);
        interact(".rib")
            .draggable({
                inertia: true,
                autoScroll: {
                    container: elContainer ? elContainer:window,
                    margin: 50,
                    speed: 400,
                    distance: 0,
                    interval: 0
                },
                onstart: function (event) {
                    changeOverflow(true);
                    let original = event.target;
                    let parent = original.parentNode;
                    let dw = original.offsetWidth;
                    let clone = original.cloneNode(true),
                        x = (parseFloat(original.getAttribute('data-x') - dw, 10) || 0),
                        y = (parseFloat(original.getAttribute('data-y'), 10) || 0);
                    clone.setAttribute("id", "clone");
                    clone.setAttribute('data-x', x);
                    clone.setAttribute('data-y', y);
                    parent.appendChild(clone);
                    // translate the element
                    clone.style.webkitTransform =
                        clone.style.transform =
                            'translate(' + (x) + 'px, ' + (y) + 'px)';
                    clone.style.position = 'absolute';
                },
                onmove: (event) => {
                    let target = document.getElementById('clone'),
                        // keep the dragged position in the data-x/data-y attributes

                        x = (parseFloat(target.getAttribute('data-x'), 10) || 0) + event.dx,
                        y = (parseFloat(target.getAttribute('data-y'), 10) || 0) + event.dy;

                    // translate the element
                    target.style.webkitTransform =
                        target.style.transform =
                            'translate(' + (x) + 'px, ' + (y) + 'px)';
                    target.style.zIndex = '9999';

                    target.classList.add('ribdrag');

                    // update the position attributes
                    target.setAttribute('data-x', x);
                    target.setAttribute('data-y', y);

                 },
                onend: (event) => {
                    changeOverflow(false);
                    let original = event.target;
                    let parent = original.parentNode;
                    let dw = original.offsetWidth;
                    let clone = document.getElementById('clone');


                    var target = clone,
                        x = 0,
                        y = 0;
                    target.style.webkitTransform =
                        target.style.transform =
                            'translate(' + (x) + 'px, ' + y + 'px)';

                    target.style.zIndex = '9999';
                    target.style.position = 'relative';
                    target.classList.remove('ribdrag');

                    target.setAttribute('data-x', x);
                    target.setAttribute('data-y', y);

                    parent.removeChild(clone);
                    event.stopPropagation();
                }
            });

    }
}


function changeOverflow(bool) {
    document.getElementById('ribbonRow').style.overflowX = bool ? 'visible' : 'auto';
    document.getElementById('ribbon').style.overflowX = bool ? 'visible' : 'hidden';
    document.getElementById('ribbon').style.overflowY = bool ? 'visible' : 'hidden';
    document.getElementById('insideribbon').style.overflowY = bool ? 'visible' : 'hidden';
    document.getElementById('ribbonList').style.overflowY = bool ? 'visible' : 'hidden';
    document.getElementById('ribbonRow').style.overflowY = bool ? 'visible' : 'hidden';
    document.getElementById('canvas').style.zIndex = bool ? '-1' : '0';
    document.getElementById('containedCanvas').style.zIndex = bool ? '-1' : '0';
}
