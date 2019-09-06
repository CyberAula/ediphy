import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import i18n from 'i18next';
import Ediphy from '../../../core/editor/main';
import { isPage } from '../../../common/utils';
import { isFullScreenOn, fullScreenListener } from '../../../common/commonTools';
import 'bootstrap/dist/css/bootstrap.css';
import screenfull from 'screenfull';

/**
 * Visor's navigation buttons
 */
export default class VisorPlayer extends Component {
    state = {
        isFullScreenOn: isFullScreenOn(),
    };

    /**
     * Render React Component
     * @returns {code}
     */
    render() {
        let navItemsIds = this.props.navItemsIds;
        if (!Ediphy.Config.sections_have_content) {
            navItemsIds = this.props.navItemsIds.filter(this.isntSection);
        }

        let navItemSelected = this.getCurrentNavItem(this.props.currentViews);
        let index = navItemsIds.indexOf(navItemSelected);
        let maxIndex = navItemsIds.length;

        return(
            <div id="player"
                className={this.props.fadePlayerClass}
                onMouseEnter={() => {this.props.setHover();}}
                onMouseLeave={() => this.props.deleteHover()}
            >
                <div className={"playerControllers"}>
                    {this.props.show ?
                        (<span className={"playerControllersSpan"}>
                            <OverlayTrigger placement="bottom" delayShow={50} trigger={['hover']} overlay={this.createTooltip("first", i18n.t("player.First"))}>
                                <Button className="playerButton"
                                    bsStyle="primary"
                                    disabled={index === 0 || maxIndex === 0}
                                    onClick={(e)=>{this.props.changeCurrentView(navItemsIds[0]);}}>
                                    <i className="material-icons">first_page</i>
                                </Button>
                            </OverlayTrigger>

                            <OverlayTrigger placement="bottom" delayShow={0} trigger={['hover']} rootClose overlay={this.createTooltip("previous", i18n.t("player.Previous")) }>
                                <Button className="playerButton"
                                    bsStyle="primary"
                                    disabled={index === 0 || maxIndex === 0}
                                    onClick={(e)=>{this.props.changeCurrentView(navItemsIds[Math.max(index - 1, 0)], true);}}>
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
                                    onClick={(e)=>{this.props.changeCurrentView(navItemsIds[Math.min(index + 1, maxIndex - 1)], false);}}>
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
                        <Button className="playerButton fullScreenButton"
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
        for (let id of ids) {
            if (isPage(id)) {
                return id;
            }
        }
        return null;
    }

    checkFullScreen = () => {
        this.setState({ isFullScreenOn: !this.state.isFullScreenOn });
    };
}

VisorPlayer.propTypes = {
    /**
     * Whether navigation buttons should be displayed or not
     */
    show: PropTypes.bool,
    /**
     * Changes current view
     */
    changeCurrentView: PropTypes.func.isRequired,
    /**
     * Dictionary that contains all views and contained views. The key for each value is the identifier of the view
     */
    currentViews: PropTypes.array.isRequired,
    /**
     * Objects Array that contains all created views (identified by its *id*)
     */
    navItemsIds: PropTypes.array.isRequired,
    /**
     * CSS class used to hide player when mouse stops moving
     */
    fadePlayerClass: PropTypes.string,
    /**
     * Function that allows to add the hover class to the player and the arrow tab
     */
    setHover: PropTypes.func,
    /**
     * Function that allows to delete the hover class in he player and the arrow tab
     */
    deleteHover: PropTypes.func,
};
