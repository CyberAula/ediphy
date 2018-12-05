import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import i18n from 'i18next';
import Ediphy from '../../../core/editor/main';
import { isPage } from '../../../common/utils';
import { isFullScreenOn, fullScreenListener } from '../../../common/common_tools';
import 'bootstrap/dist/css/bootstrap.css';
import screenfull from 'screenfull';

/**
 * Visor's navigation buttons
 */
export default class VisorPlayer extends Component {
    constructor(props) {
        super(props);
        /**
         * Component's initial state
         * @type {{isFullScreenOn: *}}
         */
        this.state = {
            isFullScreenOn: isFullScreenOn(),
        };
        this.checkFullScreen = this.checkFullScreen.bind(this);
    }

    /**
     * Render React Component
     * @returns {code}
     */
    render() {
        let navItemsIds = this.props.navItemsIds;
        if (!Ediphy.Config.sections_have_content) {
            navItemsIds = this.props.navItemsIds.filter(this.isntSection);
        }

        let navItemsById = this.props.navItemsById;
        let navItemSelected = this.getCurrentNavItem(this.props.currentViews);

        let index = navItemsIds.indexOf(navItemSelected);
        let maxIndex = navItemsIds.length;

        return(
            <div id="player" className={this.props.fadePlayerClass} style={{ width: '100%' }}>
                <div className={"playerControllers"}>
                    {this.props.show ?
                        (<span>
                            <OverlayTrigger placement="bottom" delayShow={50} trigger={['hover']} overlay={this.createTooltip("first", i18n.t("player.First"))}>
                                <Button className="playerButton"
                                    bsStyle="primary"
                                    disabled={index === 0 || maxIndex === 0}
                                    onClick={(e)=>{this.props.changeCurrentView(navItemsIds[0]);}}>
                                    <i className="material-icons">first_page</i>
                                </Button>
                            </OverlayTrigger>

                            <OverlayTrigger placement="bottom" delayShow={0} trigger={['hover']} rootClose overlay={this.createTooltip("previous", i18n.t("player.Previous"))}>
                                <Button className="playerButton"
                                    bsStyle="primary"
                                    disabled={index === 0 || maxIndex === 0}
                                    onClick={(e)=>{this.props.changeCurrentView(navItemsIds[Math.max(index - 1, 0)]);}}>
                                    <i className="material-icons">chevron_left</i>
                                </Button>
                            </OverlayTrigger>
                            <span className="playerSpan"
                                disabled={index === 0 || maxIndex === 0} >
                                <input type="text" value={index + 1} onChange={(e)=>{
                                    let newInd = e.target.value;
                                    if (newInd && !isNaN(newInd) && newInd > 0 && newInd <= navItemsIds.length) {
                                        this.props.changeCurrentView(navItemsIds[Math.min(Math.max(newInd - 1, 0), navItemsIds.length - 1)]);
                                    }
                                }}/>
                               / {navItemsIds.length}
                            </span>
                            <OverlayTrigger placement="bottom" delay={0} trigger={['hover']} rootClose overlay={this.createTooltip("next", i18n.t("player.Next"))}>
                                <Button className="playerButton"
                                    bsStyle="primary"
                                    disabled={index === maxIndex - 1 || maxIndex === 0}
                                    onClick={(e)=>{this.props.changeCurrentView(navItemsIds[Math.min(index + 1, maxIndex - 1)]);}}>
                                    <i className="material-icons">chevron_right</i>
                                </Button>
                            </OverlayTrigger>
                            <OverlayTrigger placement="bottom" delay={0} trigger={['hover']} rootClose overlay={this.createTooltip("last", i18n.t("player.Last"))}>
                                <Button className="playerButton"
                                    bsStyle="primary"
                                    disabled={index === maxIndex - 1 || maxIndex === 0}
                                    onClick={(e)=>{this.props.changeCurrentView(navItemsIds[maxIndex - 1]);}}>
                                    <i className="material-icons">last_page</i>
                                </Button>
                            </OverlayTrigger>

                        </span>) :
                        null }
                    <OverlayTrigger placement="bottom" delay={0} trigger={['hover']} rootClose overlay={this.createTooltip("fullscreen", i18n.t("messages.fullscreen"))}>
                        <Button className="playerButton"
                            bsStyle="primary"
                            onClick={(e)=> {
                                let el = document.getElementById('root');
                                // let el = document.documentElement;
                                screenfull.toggle(el);
                            // this.setState({ isFullScreenOn: !this.state.isFullScreenOn });
                            }}>
                            {this.state.isFullScreenOn ?
                                (<i className="material-icons">fullscreen_exit</i>) :
                                (<i className="material-icons">fullscreen</i>)}
                        </Button>
                    </OverlayTrigger>
                </div>
            </div>
        );
    }

    isntSection(page) {
        return (page.indexOf("se") === -1);
    }

    createTooltip(id, message) {
        return(<Tooltip id={id}>{message}</Tooltip>);
    }

    componentDidMount() {
        // screenfull.on('change', this.checkFullScreen)
        fullScreenListener(this.checkFullScreen, true);
    }

    /**
     * Remove fullscreen listeners
     */
    componentWillUnmount() {
        // screenfull.off('change', this.checkFullScreen);
        fullScreenListener(this.checkFullScreen, false);
    }

    getCurrentNavItem(ids) {
        return ids.reduce(e=>{
            if (isPage(e)) {
                return e;
            }
            return null;
        });
    }

    checkFullScreen() {
        this.setState({ isFullScreenOn: !this.state.isFullScreenOn });
    }

}

VisorPlayer.propTypes = {
    /**
     * Indica si se muestran o ocultan los botones de navegación
     */
    show: PropTypes.bool,
    /**
     * Cambia la vista actual
     */
    changeCurrentView: PropTypes.func.isRequired,
    /**
     Diccionario que contiene todas las vistas y vistas contenidas, accesibles por su *id*
     */
    currentViews: PropTypes.array.isRequired,
    /**
     * Diccionario que contiene todas las vistas, accesibles por su *id*
     */
    navItemsById: PropTypes.object.isRequired,
    /**
     * Objects Array that contains all created views (identified by its *id*)
     */
    navItemsIds: PropTypes.array.isRequired,
    /**
     * Clase CSS para ocultar el Player al dejar de mover el raton
     */
    fadePlayerClass: PropTypes.string,
};
