import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import i18n from 'i18next';
import Dali from './../../../core/main';
import { isPage } from '../../../common/utils';
import { toggleFullScreen, isFullScreenOn } from '../../../common/common_tools';
import 'bootstrap/dist/css/bootstrap.css';

export default class VisorPlayer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isFullScreenOn: isFullScreenOn(),
        };
    }

    render() {

        let navItemsIds = this.props.navItemsIds;
        if (!Dali.Config.sections_have_content) {
            navItemsIds = this.props.navItemsIds.filter(this.isntSection);
        }

        let navItemsById = this.props.navItemsById;
        let navItemSelected = this.getCurrentNavItem(this.props.currentViews);

        let index = navItemsIds.indexOf(navItemSelected);
        let maxIndex = navItemsIds.length;

        return(
            /* jshint ignore:start */
            <div id="player">
                <OverlayTrigger placement="bottom" delayShow={50} trigger={['hover']} overlay={this.createTooltip("first", i18n.t("player.First"))}>
                    <Button className="playerButton"
                        bsStyle="primary"
                        disabled={maxIndex === 0}
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
                        disabled={maxIndex === 0}
                        onClick={(e)=>{this.props.changeCurrentView(navItemsIds[maxIndex - 1]);}}>
                        <i className="material-icons">last_page</i>
                    </Button>
                </OverlayTrigger>
                <OverlayTrigger placement="bottom" delay={0} trigger={['hover']} rootClose overlay={this.createTooltip("fullscreen", i18n.t("messages.fullscreen"))}>
                    <Button className="playerButton"
                        bsStyle="primary"
                        onClick={(e)=>{toggleFullScreen(); this.setState({ isFullScreenOn: isFullScreenOn() });}}>
                        {this.state.isFullScreenOn ?
                            (<i className="material-icons">fullscreen_exit</i>) :
                            (<i className="material-icons">fullscreen</i>)}
                    </Button>
                </OverlayTrigger>
            </div>
            /* jshint ignore:end */
        );
    }

    isntSection(page) {
        return (page.indexOf("se") === -1);
    }

    createTooltip(id, message) {
        /* jshint ignore:start */
        /* Añadir aquí i18n next para traducir el tooltip*/
        return(<Tooltip id={id}>{message}</Tooltip>);
        /* jshint ignore:end */
    }

    getCurrentNavItem(ids) {
        return ids.reduce(e=>{
            if (isPage(e)) {
                return e;
            }
            return null;
        });
    }

}
