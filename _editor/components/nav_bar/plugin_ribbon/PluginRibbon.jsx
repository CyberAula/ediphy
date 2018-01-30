import React, { Component } from 'react';
import { Button, Col } from 'react-bootstrap';
import interact from 'interactjs';
import PropTypes from 'prop-types';
import Ediphy from '../../../../core/editor/main';
import ReactDOM from 'react-dom';
import i18n from 'i18next';
import './_pluginRibbon.scss';
import { isSortableBox, isSlide, isContainedView } from "../../../../common/utils";
import { ADD_BOX } from "../../../../common/actions";
import Alert from './../../common/alert/Alert';
import { ID_PREFIX_SORTABLE_CONTAINER } from "../../../../common/constants";
import { randomPositionGenerator } from './../../clipboard/clipboard.utils';

/**
 * Plugin ribbon inside toolbar
 */
export default class PluginRibbon extends Component {
    /**
     * Constructor
     * @param props
     */
    constructor(props) {
        super(props);
        this.state = {
            buttons: [],
            clipboardAlert: false,
            showed: true,
            alert: null,
        };
    }

    /**
     * Render React Component
     * @returns {code}
     */
    render() {
        return (
            <Col id="ribbon" md={12} xs={12} ref="holder" >
                <div id="insideribbon">
                    <div id="ribbonList">
                        {this.state.alert}
                        {this.state.buttons.map((item, index) => {
                            let button = this.state.buttons[index];
                            if (button.category === this.props.category || this.props.category === 'all') {
                                let clase = "" + button.icon;
                                return (<div key={index} className="buttonPlace">
                                    <Button className={"rib " + (button.allowFloatingBox ? "floatingEditorBox" : "")}
                                        disabled={this.props.disabled}
                                        key={index}
                                        name={item.name}
                                        bsSize="large"
                                        draggable="false"
                                        onClick={(event) => {
                                            this.ClickAddBox(event);
                                        }}
                                        style={(button.iconFromUrl) ? {
                                            padding: '8px 8px 8px 45px',
                                            backgroundImage: 'url(' + clase + ')',
                                            backgroundSize: '32px',
                                            backgroundPosition: '8px',
                                            backgroundRepeat: 'no-repeat',
                                        } : {}
                                        }>
                                        <i className="material-icons" style={(button.iconFromUrl) ? { display: 'none' } : {}}>{clase}</i> {button.displayName}
                                    </Button>
                                </div>);
                            }
                            return null;
                        })}

                    </div>
                </div>

            </Col>
        );
    }

    /**
     * Scroll handler
     * @param e
     */
    handleScroll(e) {
        let element = this.props.containedViewSelected !== 0 ? document.getElementById("containedCanvas") : document.getElementById("canvas");
        if (e.deltaY > 0) { // scroll-down
            element.scrollTop = element.scrollTop + 20;
        }else{ // scroll-up
            element.scrollTop = element.scrollTop - 20;
        }
    }

    /**
     * Before component unmounts
     */
    componentWillUnmount() {
        const holder = ReactDOM.findDOMNode(this.refs.holder);
        holder.removeEventListener('mousewheel', this.handleScroll);
    }

    /**
     * Reset interact container
     * @param nextProps
     * @param nextState
     */
    componentDidUpdate() {
        let container;
        if(this.props.containedViewSelected !== 0) {
            container = "containedCanvas";
        }else{
            container = "canvas";
        }
        interact(".rib")
            .draggable({
                autoScroll: {
                    container: document.getElementById(container),
                    margin: 50,
                    speed: 400,
                    distance: 0,
                    interval: 0,
                },
            });

    }

    /**
     * After component mounts
     * Load available plugins from API
     * Set interact and other listeners
     */
    componentDidMount() {
        Ediphy.API_Private.listenEmission(Ediphy.API_Private.events.addMenuButtons, e => {
            this.setState({ buttons: this.state.buttons.concat(e.detail) });

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
                    onstart: function(event) {
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

                        let target = clone,
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
                    },
                });
        });
    }

    /**
     * Before component unmounts
     * Remove interact reference and listeners
     */
    componentWillUnmount() {
        interact('.rib').unset();
    }

    ClickAddBox(event) {
        let alert = (<Alert className="pageModal"
            show
            hasHeader
            backdrop={false}
            title={ <span><i className="material-icons" style={{ fontSize: '14px', marginRight: '5px', color: 'yellow' }}>warning</i>{ i18n.t("messages.alert") }</span> }
            closeButton onClose={()=>{this.setState({ alert: null });}}>
            <span> {i18n.t('messages.instance_limit')} </span>
        </Alert>);

        let cv = this.props.containedViewSelected !== 0 && isContainedView(this.props.containedViewSelected.id) && isSlide(this.props.containedViewSelected.type);
        let cvdoc = this.props.containedViewSelected !== 0 && isContainedView(this.props.containedViewSelected.id) && !isSlide(this.props.containedViewSelected.type);

        if (isSlide(this.props.navItemSelected.type) || cv) {

            let SelectedNav = cv ? this.props.containedViewSelected.id : this.props.navItemSelected.id;
            if (Ediphy.Plugins.get(event.target.getAttribute("name")).getConfig().limitToOneInstance) {
                for (let child in this.props.boxes) {
                    if (!isSortableBox(child) && this.props.boxes[child].parent === SelectedNav && this.props.toolbars[child].config.name === event.target.getAttribute("name")) {
                        this.setState({ alert: alert });
                        event.stopPropagation();
                        return;
                    }
                }
            }
            let position = {
                x: randomPositionGenerator(20, 40),
                y: randomPositionGenerator(20, 40),
                type: 'absolute',
            };
            let initialParams = {
                parent: SelectedNav,
                container: 0,
                position: position,
            };
            Ediphy.Plugins.get(event.target.getAttribute("name")).getConfig().callback(initialParams, ADD_BOX);
            event.stopPropagation();
        } else {
            let parentBox = cvdoc ? this.props.containedViewSelected.boxes[0] : this.props.navItemSelected.boxes[0];

            // Check if there is a limit in the number of plugin instances
            if (isSortableBox(parentBox) && Ediphy.Plugins.get(event.target.getAttribute("name")).getConfig().limitToOneInstance) {
                for (let child in this.props.boxes) {

                    if (!isSortableBox(child) && this.props.boxes[child].parent === parentBox && this.props.toolbars[child].config.name === event.target.getAttribute("name")) {

                        this.setState({ alert: alert });
                        event.stopPropagation();
                        return;
                    }
                }
            }
            let initialParams = {
                parent: parentBox,
                container: ID_PREFIX_SORTABLE_CONTAINER + Date.now(), col: 0, row: 0,
            };
            console.log(initialParams);

            Ediphy.Plugins.get(event.target.getAttribute("name")).getConfig().callback(initialParams, ADD_BOX);
            event.stopPropagation();
        }

    }
}

/** *
 * Change ribbon CSS while dragging plugin in order to avoid overflow and scroll bug
 * @param bool
 */
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

PluginRibbon.propTypes = {
    /**
    * Indica si los plugins del ribbon están desactivados
    */
    disabled: PropTypes.bool,
    /**
  * Vista seleccionada
  */
    navItemSelected: PropTypes.any.isRequired,
    /**
  * Vista contenida seleccionada
  */
    containedViewSelected: PropTypes.any.isRequired,
    /**
  * Categoría de plugin seleccionada
  */
    category: PropTypes.string,
    /**
  * Altura del ribbon
  */
    ribbonHeight: PropTypes.string,
};
