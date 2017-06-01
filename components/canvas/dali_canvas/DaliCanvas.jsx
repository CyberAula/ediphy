import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {Col} from 'react-bootstrap';
import DaliCanvasSli from '../dali_canvas_sli/DaliCanvasSli';
import DaliCanvasDoc from '../dali_canvas_doc/DaliCanvasDoc';
import interact from 'interact.js';
import {ADD_BOX,REORDER_SORTABLE_CONTAINER} from '../../../actions';
import Dali from './../../../core/main';
import {isSlide} from './../../../utils';


export default class DaliCanvas extends Component {
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
        let canvasContent;
        if (isSlide(this.props.navItemSelected.type)) {
            canvasContent = <DaliCanvasSli navItemSelected={this.props.navItemSelected}
                                           navItems={this.props.navItems}
                                           boxes={this.props.boxes}
                                           boxSelected={this.props.boxSelected}
                                           boxLevelSelected={this.props.boxLevelSelected}
                                           toolbars={this.props.toolbars}
                                           containedViewSelected={this.props.containedViewSelected}/>;
        }else{
            canvasContent = <DaliCanvasDoc navItemSelected={this.props.navItemSelected}
                                           navItems={this.props.navItems}
                                           boxes={this.props.boxes}
                                           boxSelected={this.props.boxSelected}
                                           boxLevelSelected={this.props.boxLevelSelected}
                                           toolbars={this.props.toolbars}
                                           containedViewSelected={this.props.containedViewSelected}/>;
        }

        return (
            /* jshint ignore:start */

            <DaliCanvasDoc navItemSelected={this.props.navItemSelected}
                           navItems={this.props.navItems}
                           boxes={this.props.boxes}
                           boxSelected={this.props.boxSelected}
                           boxLevelSelected={this.props.boxLevelSelected}
                           toolbars={this.props.toolbars}
                           containedViewSelected={this.props.containedViewSelected}/>


            /* jshint ignore:end */
        );
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.boxSelected !== -1) {
            this.setState({showTitle: false});
        }
        if (this.props.navItemSelected.id !== nextProps.navItemSelected.id) {
            document.getElementById('maincontent').scrollTop = 0;
        }
    }

    componentDidUpdate(prevProps, prevState) {
        //Fixes bug when reordering dalibox sortable CKEDITOR doesn't update otherwise
        if(this.props.lastActionDispatched.type === REORDER_SORTABLE_CONTAINER){
             for (let instance in CKEDITOR.instances) {
                CKEDITOR.instances[instance].destroy();
             }
             CKEDITOR.inlineAll();
             for (let editor in CKEDITOR.instances){
                 if (this.props.toolbars[editor].state.__text) {
                    CKEDITOR.instances[editor].setData(decodeURI(this.props.toolbars[editor].state.__text));
                }
             }
        }
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
    }
}
