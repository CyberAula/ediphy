import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { isPage, isSection } from '../../../../common/utils';
import { FormControl } from 'react-bootstrap';
import Ediphy from '../../../../core/editor/main';
import i18n from 'i18next';

import './_editorIndexTitle.scss';

/**
 * Component for editing index elements in situ
 */
export default class EditorIndexTitle extends Component {
    /**
     * Constructor
     * @param props
     */
    constructor(props) {
        super(props);
        /**
         * Component's initial state
         */
        this.state = {
            editing: false,
            currentValue: this.props.title,
        };
    }

    /**
     * Renders React Component
     * @returns {code}
     */
    render() {
        return (
            <span id={this.props.id}>
                {!this.state.editing ?
                    (<div className="actualSectionTitle" id={'title_' + this.props.id}
                        style={{ textDecoration: this.props.hidden ? "line-through" : "initial" }}
                        onMouseOver={() =>{
                            // let markEl = document.getElementById('title_' + this.props.id);
                            // markEl.style.transitionDuration = this.props.scrollW / 100 + 's';
                            // markEl.style.width = this.props.scrollW + '%';
                            // markEl.style.left = '-' + (this.props.scrollW - 100) + '%';
                        }}
                        onMouseOut={() =>{
                            // let markEl = document.getElementById('title_' + this.props.id);
                            // markEl.style.width = '90%';
                            // markEl.style.left = '0%';
                        }}
                        onDoubleClick={e => {
                            this.setState({ editing: !this.state.editing });
                            if (this.state.editing) { /* Save changes to Redux state*/
                                this.props.onNameChanged(this.props.id, { viewName: this.state.currentValue });
                                // Synchronize current component state with Redux state when entering edition mode
                            } else {
                                this.setState({ currentValue: this.props.title });
                            }
                            e.stopPropagation();
                        }}>
                        {Ediphy.Config.show_numbers_before_navitems ? this.props.index : ""} {(this.props.title && this.props.title !== "") ? this.props.title : ((this.props.courseTitle) ? i18n.t('Title_document') : i18n.t('Page'))}
                    </div>) :
                    (<FormControl
                        type="text"
                        ref="titleIndex"
                        placeholder={(this.props.courseTitle) ? i18n.t('Title_document') : i18n.t('Page')}
                        className={this.props.id ? "editSectionTitle" : "editTitle"}
                        value={this.state.currentValue}
                        onKeyDown={e=> {
                            if (e.keyCode === 13) { // Enter Key
                                this.setState({ editing: !this.state.editing });
                                if (this.props.courseTitle) {
                                    this.props.onNameChanged('title', this.state.currentValue);
                                } else {
                                    this.props.onNameChanged(this.props.id, (this.state.currentValue.length > 0) ? { viewName: this.state.currentValue } : this.getDefaultValue());
                                }
                            }
                            if (e.keyCode === 27) { // Escape key
                                this.setState({ editing: !this.state.editing });
                            }
                        }}
                        onFocus={e => {
                        /* Select all the content when enter edition mode*/
                            e.target.setSelectionRange(0, e.target.value.length);

                        }}
                        onChange={e => {
                        /* Save it on component state, not Redux*/
                            this.setState({ currentValue: e.target.value });
                        }}
                        onBlur={e => {
                        /* Change to non-edition mode*/
                            this.setState({ editing: !this.state.editing });
                            if(this.props.courseTitle) {
                                this.props.onNameChanged('title', this.state.currentValue);
                            } else {
                                this.props.onNameChanged(this.props.id, (this.state.currentValue.length > 0) ? { viewName: this.state.currentValue } : this.getDefaultValue());
                            }
                        }} />
                    )
                }
                <i className="material-icons"
                    style={{ position: "absolute", right: "0", color: this.props.hidden ? "gray" : "white" }}>{this.props.hidden ? "visibility_off" : ""}</i>
            </span>
        );
    }

    /**
     * Get default value if left empty
     * @returns {string}
     */
    getDefaultValue() {
        if (isPage(this.props.id)) {
            return i18n.t("page");
        } else if(isSection(this.props.id)) {
            return i18n.t("section");
        }
        return "Blank";

    }

}

EditorIndexTitle.propTypes = {
    /**
     * Selected index identifier
     */
    id: PropTypes.string,
    /**
     * Selected index title
     */
    title: PropTypes.string.isRequired,
    /**
     * Selected index number
     */
    index: PropTypes.any,
    /**
     * Private navItem indicator (show/hide in visor and exported)
     */
    hidden: PropTypes.bool,
    /**
     * Callback for changing page title
     */
    onNameChanged: PropTypes.func.isRequired,
    /**
     * Course title
     */
    courseTitle: PropTypes.any,
};
