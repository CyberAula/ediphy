import React, { Component } from 'react';
import i18n from 'i18next';
import PropTypes from 'prop-types';
import { connect } from "react-redux";
import { Tooltip, OverlayTrigger } from 'react-bootstrap';

import Ediphy from "../../../../core/editor/main";
import PluginToolbar from '../pluginToolbar/PluginToolbar';
import ViewToolbar from '../viewToolbar/ViewToolbar';

import { isCanvasElement, isSlide } from "../../../../common/utils";
import { changeBackground } from "../../../../common/actions";
import _handlers from "../../../handlers/_handlers";
import ErrorBoundary from "../../../containers/ErrorBoundary";
import { ToolbarTabs, ToolbarTitle } from "../Styles";
import { Flap, InsideTools, PluginTitle, TitleText, ToolbarHeader, Tools, Wheel, Wrapper } from "./Styles";

class Toolbar extends Component {

    state = { open: false };
    h = _handlers(this);

    render() {

        const { box, boxSelected, exercises, navItemsById, navItemSelected, pluginToolbarsById, top } = this.props;

        let toolbar = null;
        let title = "";
        let noBoxSelected = boxSelected === -1 && isCanvasElement(navItemSelected, Ediphy.Config.sections_have_content);
        let noPageSelected = false;
        if (!exercises[navItemSelected]) {
            noPageSelected = true;
        } else if(noBoxSelected) {
            toolbar = <ViewToolbar {...this.props}
                onBackgroundChanged={this.onBackgroundChanged}
                open={this.state.open}
                exercises={exercises[navItemSelected]}
                toggleToolbar={this.toggleToolbar} />;

            title = ((isSlide(navItemsById[navItemSelected].type) ? (navItemsById[navItemSelected].customSize === 0 ? i18n.t('slide') : "PDF") : i18n.t('page')) || "");
        } else {
            toolbar = <PluginToolbar {...this.props}
                onBackgroundChanged={this.onBackgroundChanged}
                open={this.state.open}
                exercises={exercises[navItemSelected].exercises[boxSelected]}
                toggleToolbar={this.toggleToolbar}
                openConfigModal={this.h.openConfigModal} />;
            let tb = pluginToolbarsById[box.id];
            let apiPlugin = Ediphy.Plugins.get(tb.pluginId);
            let config = apiPlugin ? apiPlugin.getConfig() : {};
            title = (config.displayName || "");
        }
        let open = (!noPageSelected && this.state.open);
        const overlay = <Tooltip className={open ? 'hidden' : ''} id="tooltip_props">{i18n.t('Properties')}</Tooltip>;
        return (
            <Wrapper top={top}>
                <ErrorBoundary context={'toolbar'}>
                    <Flap onClick={this.toggleToolbar}/>
                    <Tools open={open}>
                        <OverlayTrigger placement="left" overlay={overlay}>
                            <ToolbarHeader onClick={this.toggleToolbar}>
                                <ToolbarTitle>
                                    <Wheel>settings</Wheel>
                                    <TitleText open={open}> {i18n.t('Properties')} </TitleText>
                                </ToolbarTitle>
                                <PluginTitle open={open}>
                                    {title}
                                </PluginTitle>
                            </ToolbarHeader>
                        </OverlayTrigger>

                        <InsideTools open={open}>
                            <ToolbarTabs children={toolbar}/>
                        </InsideTools>
                    </Tools>
                </ErrorBoundary>
            </Wrapper>
        );
    }
    onBackgroundChanged = (id, background) => this.props.dispatch(changeBackground(id, background));
    toggleToolbar = () => this.setState({ open: !this.state.open });
}

function mapStateToProps(state) {
    const { pluginToolbarsById, viewToolbarsById, boxesById, boxSelected, containedViewsById, containedViewSelected } = state.undoGroup.present;
    return {
        pluginToolbarsById,
        viewToolbarsById,
        box: state.undoGroup.present.boxesById[state.undoGroup.present.boxSelected],
        boxesById,
        boxSelected,
        containedViewsById,
        containedViewSelected,
        navItemSelected: state.undoGroup.present.containedViewSelected !== 0 ? state.undoGroup.present.containedViewSelected : state.undoGroup.present.navItemSelected,
        navItemsById: state.undoGroup.present.containedViewSelected !== 0 ? state.undoGroup.present.containedViewsById : state.undoGroup.present.navItemsById,
        carouselShow: state.reactUI.carouselShow,
        isBusy: state.undoGroup.present.isBusy,
        marks: state.undoGroup.present.marksById,
        exercises: state.undoGroup.present.exercises,
        fileModalResult: state.reactUI.fileModalResult,
        reactUI: state.reactUI,
    };
}

export default connect(mapStateToProps)(Toolbar);

Toolbar.propTypes = {
    /**
     * Selected box
     */
    boxSelected: PropTypes.any,
    /**
     * Redux actions trigger
     */
    dispatch: PropTypes.func,
    /**
     * Current selected view (by ID)
     */
    navItemSelected: PropTypes.any,
    /**
     * View toolbars
     */
    viewToolbarsById: PropTypes.object,
    /**
     * Plugin toolbars
     */
    pluginToolbarsById: PropTypes.object,
    /**
     * Object containing the current box
     */
    box: PropTypes.object,
    /**
     * Top position
     */
    top: PropTypes.string,
    /**
     * Whether or not it should be toggled or visible
     */
    carouselShow: PropTypes.bool,
    /**
     * Object containing all exercises
     */
    exercises: PropTypes.object,
    /**
     * Object containing all views (by id)
     */
    navItemsById: PropTypes.object.isRequired,
    /**
     * Object containing all contained views (by id)
     */
    containedViewsById: PropTypes.object.isRequired,
};
