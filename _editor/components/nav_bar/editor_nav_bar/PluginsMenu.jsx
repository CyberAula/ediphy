import i18n from 'i18next';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

/**
 * Plugin menu in the editor's navbar
 */
export default class PluginsMenu extends Component {
    /**
     * Constructor
     */
    constructor(props) {
        super(props);
    }

    /**
     * Click on plugin category callback
     */
    openPlugin(category) {
        this.props.setcat(category);
    }

    /**
     * Render React Component
     * @returns {code}
     */
    render() {
        return (
            <div className="pluginsMenu" onClick={()=> this.openPlugin("")}>
                <button
                    className={ this.props.hideTab === 'show' && this.props.category === 'image' ? 'navButtonPlug active' : 'navButtonPlug' }
                    title={i18n.t("Images")} disabled={false /* disablePlugins*/}
                    onClick={(e) => { this.props.category === 'image' ? this.openPlugin('') : this.openPlugin('image'); e.stopPropagation();}}>
                    <i className="material-icons showonresize">image</i><span className="hideonresize"> {i18n.t("Images")}</span>
                </button>
                <button
                    className={ this.props.hideTab === 'show' && this.props.category === 'text' ? 'navButtonPlug active' : 'navButtonPlug' }
                    title={i18n.t("Text")} disabled={false /* disablePlugins*/}
                    onClick={(e) => { this.props.category === 'text' ? this.openPlugin('') : this.openPlugin('text'); e.stopPropagation();}}>
                    <i className="material-icons showonresize">text_fields</i><span className="hideonresize">{i18n.t("Text")}</span>
                </button>
                <button
                    className={ this.props.hideTab === 'show' && this.props.category === 'multimedia' ? 'navButtonPlug active' : 'navButtonPlug' }
                    title={i18n.t("Multimedia")} disabled={false /* disablePlugins*/}
                    onClick={(e) => { this.props.category === 'multimedia' ? this.openPlugin('') : this.openPlugin('multimedia'); e.stopPropagation();}}>
                    <i className="material-icons showonresize">play_circle_outline</i><span className="hideonresize">{i18n.t("Multimedia")}</span>
                </button>
                <button
                    className={ this.props.hideTab === 'show' && this.props.category === 'objects' ? ' navButtonPlug active' : 'navButtonPlug' }
                    title={i18n.t("Objects")} disabled={false /* disablePlugins*/}
                    onClick={(e) => { this.props.category === 'objects' ? this.openPlugin('') : this.openPlugin('objects'); e.stopPropagation();}}>
                    <i className="material-icons showonresize">unarchive</i><span className="hideonresize">{i18n.t("Objects")}</span>
                </button>
                <button
                    className={ this.props.hideTab === 'show' && this.props.category === 'evaluation' ? 'navButtonPlug active' : 'navButtonPlug' }
                    title={i18n.t("Evaluation")} disabled={false /* disablePlugins*/}
                    style={{ display: 'none' }}
                    onClick={(e) => { this.props.category === 'evaluation' ? this.openPlugin('') : this.openPlugin('evaluation'); e.stopPropagation(); }}>
                    <span className="hideonresize">{i18n.t("Evaluation")}</span>
                </button>
                <div className="togglePlugins"><i className="material-icons">widgets</i></div>
            </div>
        );
    }
}

PluginsMenu.propTypes = {
    /**
     * Plugin's category shown
     */
    category: PropTypes.string.isRequired,
    /**
     * Toggles the plugin bar's visibility
     */
    hideTab: PropTypes.oneOf(["show", "hide"]).isRequired,
    /**
     * Changes the chosen plugin category
     * */
    setcat: PropTypes.func.isRequired,
};
