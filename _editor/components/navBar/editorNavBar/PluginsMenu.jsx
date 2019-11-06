import i18n from 'i18next';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { updateUI } from "../../../../common/actions";
import { connect } from "react-redux";
import { PluginButton, PluginIcon, PluginName, PluginsMenus } from "./Styles";

/**
 * Plugin menu in the editor's navbar
 */
class PluginsMenu extends Component {

    state = { categories: [] };

    /**
     * Render React Component
     * @returns {code}
     */
    render() {
        const { reactUI } = this.props;
        const categories = [
            {
                name: 'image',
                displayName: i18n.t("Images"),
                icon: 'image',
            },
            {
                name: 'text',
                displayName: i18n.t("Text"),
                icon: 'text_fields',
            },
            {
                name: 'multimedia',
                displayName: i18n.t("Multimedia"),
                icon: 'play_circle_outline',
            },
            {
                name: 'objects',
                displayName: i18n.t("Objects"),
                icon: 'unarchive',
            },
            {
                name: 'evaluation',
                displayName: i18n.t("Evaluation"),
                icon: 'school',
            },

        ];
        return (
            <PluginsMenus onClick={()=> this.openPlugin("")}>
                {categories.map((cat, ind)=>{
                    if (this.state.categories.indexOf(cat.name) > -1) {
                        return (
                            <PluginButton key={ind}
                                className={ reactUI.hideTab === 'show' && reactUI.pluginTab === cat.name ? 'navButtonPlug active' : 'navButtonPlug' }
                                title={cat.displayName}
                                disabled={false}
                                onClick={(e) => this.selectCategory(e, cat)}>
                                <PluginIcon children={cat.icon}/>
                                <PluginName children={cat.displayName}/>
                            </PluginButton>);
                    }
                    return null;
                })}
            </PluginsMenus>
        );
    }

    /**
     * Click on plugin category callback
     */
    openPlugin = (category) => {
        this.props.dispatch(updateUI({
            pluginTab: category,
            hideTab: 'show',
        }));
    };

    selectCategory = (event, category) => {
        const isSelected = this.props.reactUI.pluginTab === category.name;
        if(isSelected) {
            this.openPlugin('');
        } else {
            this.openPlugin(category.name);
        }
        event.stopPropagation();
    };

    componentDidMount() {
        // Only will show categories that have at least one plugin inside
        let categories = [];
        let plugins = Ediphy.Plugins.getPluginConfigs();
        for (let plug in plugins) {
            if (categories.indexOf(plugins[plug].category) === -1) {
                categories.push(plugins[plug].category);
            }
        }
        this.setState({ categories });
    }
}

function mapStateToProps(state) {
    return {
        reactUI: state.reactUI,
    };
}

export default connect(mapStateToProps)(PluginsMenu);

PluginsMenu.propTypes = {
    /**
     * React UI params
     */
    reactUI: PropTypes.object.isRequired,
    /**
     * Redux actions trigger
     */
    dispatch: PropTypes.func,
};
