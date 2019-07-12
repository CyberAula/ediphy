import React, { Component } from 'react';
import i18n from 'i18next';
import ViewToolbar from '../view_toolbar/ViewToolbar';
import PluginToolbar from '../plugin_toolbar/PluginToolbar';
import { isCanvasElement, isSlide } from "../../../../common/utils";
import Ediphy from "../../../../core/editor/main";
import PropTypes from 'prop-types';
import { connect } from "react-redux";
import { Tooltip, OverlayTrigger } from 'react-bootstrap';
import { changeBackground } from "../../../../common/actions";
class Toolbar extends Component {

    state = { open: false };

    render() {
        let exercises = {};
        let toolbar = null;
        let title = "";
        let noBoxSelected = this.props.boxSelected === -1 && isCanvasElement(this.props.navItemSelected, Ediphy.Config.sections_have_content);
        let noPageSelected = false;
        if (!this.props.exercises[this.props.navItemSelected]) {
            noPageSelected = true;
        } else if(noBoxSelected) {
            exercises = this.props.exercises[this.props.navItemSelected];
            toolbar = <ViewToolbar {...this.props}
                onBackgroundChanged={this.onBackgroundChanged}
                open={this.state.open}
                exercises={exercises}
                onScoreConfig={(id, button, value, page) => {this.props.onScoreConfig(id, button, value, this.props.navItemSelected);}}
                toggleToolbar={()=>this.toggleToolbar()} />;

            title = ((isSlide(this.props.navItems[this.props.navItemSelected].type) ? (this.props.navItems[this.props.navItemSelected].customSize === 0 ? i18n.t('slide') : "PDF") : i18n.t('page')) || "");
        } else {
            exercises = this.props.exercises[this.props.navItemSelected].exercises[this.props.boxSelected];
            toolbar = <PluginToolbar {...this.props}
                onBackgroundChanged={this.onBackgroundChanged}
                open={this.state.open}
                exercises={exercises}
                onScoreConfig={(id, button, value, page) => {this.props.onScoreConfig(id, button, value, this.props.navItemSelected);}}
                toggleToolbar={this.toggleToolbar}
                openConfigModal={this.props.openConfigModal} />;
            let tb = this.props.pluginToolbars[this.props.box.id];
            let apiPlugin = Ediphy.Plugins.get(tb.pluginId);
            let config = apiPlugin ? apiPlugin.getConfig() : {};
            title = (config.displayName || "");
        }
        let open = (!noPageSelected && this.state.open);
        return (
            <div id="wrap"
                className="wrapper"
                style={{
                    right: '0px',
                    top: this.props.top,
                }}>
                <div className="pestana" id="toolbarFlap"
                    onClick={this.toggleToolbar}/>
                <div id="tools"
                    style={{
                        width: open ? '250px' : '40px',
                    }}
                    className={open ? 'toolbox toolsSpread' : 'toolbox'}>
                    <OverlayTrigger placement="left"
                        overlay={
                            <Tooltip className={open ? 'hidden' : ''}
                                id="tooltip_props">
                                {i18n.t('Properties')}
                            </Tooltip>
                        }>
                        <div onClick={this.toggleToolbar}
                            style={{ display: this.props.carouselShow ? 'block' : 'block' }}
                            className={open ? 'carouselListTitle toolbarSpread' : 'carouselListTitle toolbarHide'}>
                            <div className="toolbarTitle">
                                <i id="wheel" className="material-icons">settings</i>
                                <span className="toolbarTitletxt">
                                    {i18n.t('Properties')}
                                </span>
                            </div>
                            <div className="pluginTitleInToolbar">
                                {title}
                            </div>
                        </div>
                    </OverlayTrigger>
                    <div id="insidetools" style={{ display: open ? 'block' : 'none' }}>
                        <div className="toolbarTabs">
                            {toolbar}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    toggleToolbar = () => {
        this.setState({ open: !this.state.open });
    };

    onBackgroundChanged = (id, background) => this.props.dispatch(changeBackground(id, background));

}

function mapStateToProps(state) {
    return {
        pluginToolbars: state.undoGroup.present.pluginToolbarsById,
        viewToolbars: state.undoGroup.present.viewToolbarsById,
        box: state.undoGroup.present.boxesById[state.undoGroup.present.boxSelected],
        boxSelected: state.undoGroup.present.boxSelected,
        containedViews: state.undoGroup.present.containedViewsById,
        containedViewSelected: state.undoGroup.present.containedViewSelected,
        navItemSelected: state.undoGroup.present.containedViewSelected !== 0 ? state.undoGroup.present.containedViewSelected : state.undoGroup.present.navItemSelected,
        navItems: state.undoGroup.present.containedViewSelected !== 0 ? state.undoGroup.present.containedViewsById : state.undoGroup.present.navItemsById,
        carouselShow: state.reactUI.carouselShow,
        isBusy: state.undoGroup.present.isBusy,
        marks: state.undoGroup.present.marksById,
        exercises: state.undoGroup.present.exercises,
        fileModalResult: state.reactUI.fileModalResult,
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
     * Function for configuring the scoring settings of a page or exercise
     */
    onScoreConfig: PropTypes.func,
    /**
     * View toolbars
     */
    viewToolbars: PropTypes.object,
    /**
     * Callback for opening global configuration modal
     */
    openConfigModal: PropTypes.func,
    /**
     * Plugin toolbars
     */
    pluginToolbars: PropTypes.object,
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
    navItems: PropTypes.object.isRequired,
};
