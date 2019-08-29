import React, { Component } from 'react';
import { Button, Col } from 'react-bootstrap';
import interact from 'interactjs';
import PropTypes from 'prop-types';
import Ediphy from '../../../../core/editor/main';
import ReactDOM from 'react-dom';
import i18n from 'i18next';
import './_pluginRibbon.scss';
import { isSortableBox, isSlide, isBox, isContainedView, isSortableContainer } from '../../../../common/utils';
import Alert from './../../common/alert/Alert';
import { ID_PREFIX_BOX, ID_PREFIX_SORTABLE_CONTAINER } from '../../../../common/constants';
import { randomPositionGenerator } from './../../clipboard/clipboard.utils';
import { createBox, instanceExists, releaseClick } from '../../../../common/common_tools';

import { connect } from "react-redux";
import { updateUI } from "../../../../common/actions";

/**
 * Plugin ribbon inside toolbar
 */
class PluginRibbon extends Component {
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
                <div id="insideribbon" className={this.props.category === '' ? 'noButtons' : ''}>
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
                                        onMouseUp={(e)=>{this.clickAddBox(e, item.name);}}
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
    handleScroll = (e) => {
        let element = this.props.containedViewSelected !== 0 ? document.getElementById("containedCanvas") : document.getElementById("canvas");
        if (e.deltaY > 0) { // scroll-down
            element.scrollTop = element.scrollTop + 20;
        }else{ // scroll-up
            element.scrollTop = element.scrollTop - 20;
        }
    };

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
                enabled: !this.props.disabled,
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
        this.setState({ buttons: this.state.buttons.concat(Ediphy.Plugins.getPluginConfigs()) });

        const holder = ReactDOM.findDOMNode(this.refs.holder);
        holder.addEventListener('mousewheel', this.handleScroll);

        let container;

        if (this.props.containedViewSelected !== 0) {
            container = "containedCanvas";
        } else {
            container = "canvas";
        }
        let elContainer = document.getElementById(container);
        interact.dynamicDrop(true);
        interact(".rib")
            .draggable({
                enabled: !this.props.disabled,
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
                    if (clone) {
                        let name = clone.getAttribute('name');
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

                        let releaseClickEl = document.elementFromPoint(event.clientX, event.clientY);
                        let rib = releaseClick(releaseClickEl, "ribbon");

                        if(rib === 'List') {
                            this.clickAddBox(event, name);

                        } else {
                            this.onTabHide();
                        }
                    }
                    event.stopPropagation();
                },
            });
    }

    /**
     * Before component unmounts
     * Remove interact reference and listeners
     */
    componentWillUnmount() {
        interact('.rib').unset();
    }

    onTabHide = () => {
        this.props.dispatch(updateUI({
            pluginTab: '',
        }));
    };

    clickAddBox = (event, name) => {
        let alert = (msg) => {return <Alert key="alert" className="pageModal"
            show
            hasHeader
            backdrop={false}
            title={ <span><i className="material-icons alert-warning" >warning</i>{ i18n.t("messages.alert") }</span> }
            closeButton onClose={()=>{this.setState({ alert: null });}}>
            <span> {msg} </span>
        </Alert>;};

        let cv = this.props.containedViewSelected !== 0 && isContainedView(this.props.containedViewSelected.id);
        let cvslide = cv && isSlide(this.props.containedViewSelected.type);
        let cvdoc = cv && !isSlide(this.props.containedViewSelected.type);
        let config = Ediphy.Plugins.get(name).getConfig();
        if (!config) {
            return;
        }
        let isBoxSelected = (this.props.boxSelected && isBox(this.props.boxSelected.id));
        if (isBoxSelected && isBox(this.props.boxSelected.parent) && config.isComplex) {
            this.setState({ alert: alert(i18n.t('messages.depth_limit')) });
            event.stopPropagation();
            return;
        }

        if (config.limitToOneInstance && instanceExists(name)) {
            this.setState({ alert: alert(i18n.t('messages.instance_limit')) });
            event.stopPropagation();
            return;
        }
        let inASlide = (!cv && isSlide(this.props.navItemSelected.type)) || cvslide;

        let SelectedNav = inASlide ? (cvslide ? this.props.containedViewSelected.id : this.props.navItemSelected.id) : 0;
        let parentBox = inASlide ? 0 : (cvdoc ? this.props.containedViewSelected.boxes[0] : this.props.navItemSelected.boxes[0]);

        let parent = isBoxSelected ? this.props.boxSelected.parent : (inASlide ? SelectedNav : parentBox);
        let container = isBoxSelected ? this.props.boxSelected.container : (inASlide ? 0 : (ID_PREFIX_SORTABLE_CONTAINER + Date.now()));
        let position = container === 0 ? {
            x: randomPositionGenerator(20, 40),
            y: randomPositionGenerator(20, 40),
            type: 'absolute',
        } : undefined;
        let initialParams = {
            parent: parent,
            container: container,
            name,
            position: position,
            id: ID_PREFIX_BOX + Date.now(),
            page: cv ? this.props.containedViewSelected.id : (this.props.navItemSelected ? this.props.navItemSelected.id : 0),
        };
        if (!inASlide) {
            if (isBoxSelected) {
                let newInd;
                if(isSortableContainer(initialParams.container)) {
                    let children = this.props.boxes[initialParams.parent].sortableContainers[initialParams.container].children;
                    newInd = children.indexOf(this.props.boxSelected.id) + 1;
                    newInd = newInd === 0 ? 1 : ((newInd === 0 || newInd >= children.length) ? (children.length) : newInd);
                    initialParams.index = newInd; initialParams.col = 0; initialParams.row = 0;
                }
            }
        }
        createBox(initialParams, name, inASlide, this.props.onBoxAdded, this.props.boxes);
        this.onTabHide();
        event.stopPropagation();
        event.preventDefault();

    };
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
}

function mapStateToProps(state) {
    return {
        boxSelected: state.undoGroup.present.boxesById[state.undoGroup.present.boxSelected],
        navItemSelected: state.undoGroup.present.navItemsById[state.undoGroup.present.navItemSelected],
        navItems: state.undoGroup.present.navItemsById,
        containedViewSelected: state.undoGroup.present.containedViewsById[state.undoGroup.present.containedViewSelected] || state.undoGroup.present.containedViewSelected,
        boxes: state.undoGroup.present.boxesById,
        category: state.reactUI.pluginTab,
        hideTab: state.reactUI.hideTab,
    };
}

export default connect(mapStateToProps)(PluginRibbon);

PluginRibbon.propTypes = {
    /**
    * Indicates if the plugins are disabled
    */
    disabled: PropTypes.bool,
    /**
     * Redux actions trigger
     */
    dispatch: PropTypes.func,
    /**
     * Current selected view (by ID)
     */
    navItemSelected: PropTypes.any.isRequired,
    /**
      * Selected contained view (by ID)
      */
    containedViewSelected: PropTypes.any.isRequired,
    /**
      * Selected plugin category
      */
    category: PropTypes.string,
    /**
      * Selected box
      */
    boxSelected: PropTypes.any,
    /**
      * Object containing all created boxes (by id)
      */
    boxes: PropTypes.object,
    /**
     * Callback for adding a box
     */
    onBoxAdded: PropTypes.func.isRequired,

};

