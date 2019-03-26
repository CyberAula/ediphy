import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Breadcrumb, BreadcrumbItem, FormControl } from 'react-bootstrap';
import i18n from 'i18next';
import './_editorHeader.scss';
import CVInfo from "./CVInfo";

/**
 *  EditorHeaderComponent
 *  It shows the current page's title
 */
export default class EditorHeader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            editingTitle: false,
            currentTitle: this.props.courseTitle,
            editingNavTitle: false,
            currentNavTitle: '',
            editingNavSubTitle: false,
            currentNavSubTitle: '',
        };
    }
    render() {
        if (this.props.navItem || this.props.containedView) {
            let navItem = this.props.containedView !== 0 ? this.props.containedView : this.props.navItem;
            let toolbar = (this.props.viewToolbars[navItem.id]) ? this.props.viewToolbars[navItem.id] : undefined;
            let docTitle = "";
            let subTitle = "";
            let pagenumber = "";
            if (navItem !== undefined && navItem.id !== 0 && toolbar) {
                docTitle = (toolbar.documentTitle !== "" && (toolbar.documentTitleContent !== "")) ? toolbar.documentTitleContent : toolbar.viewName;
                subTitle = toolbar.documentSubtitle !== "" && (toolbar.documentSubtitleContent !== i18n.t('subtitle')) ? toolbar.documentSubtitleContent : i18n.t('subtitle');
                pagenumber = toolbar.numPageContent !== "" ? toolbar.numPageContent : "";
            }

            let content;
            let unidad = "";
            // breadcrumb
            if (this.props.containedView === 0) {
                if (toolbar !== undefined) {
                    if (toolbar.breadcrumb === 'reduced') {
                        let titleList = this.props.titles;

                        let actualTitle = titleList[titleList.length - 1];
                        unidad = titleList[0];
                        content = React.createElement("div", { className: "subheader" },
                            React.createElement(Breadcrumb, { style: { margin: 0, backgroundColor: 'inherit' } },
                                titleList.map((item, index) => {
                                    if (index !== titleList.length) {
                                        return React.createElement(BreadcrumbItem, { key: index }, item);
                                    }
                                    return null;
                                })
                            )
                        );

                    } else if (toolbar.breadcrumb === 'expanded') {
                        let titlesComponents = "";
                        let titles_length = this.props.titles.length;
                        content = React.createElement("div", { className: "subheader" },
                            this.props.titles.map((text, index) => {
                                if (index === 0) {
                                    unidad = text;
                                } else {
                                    let nivel = (index > 4) ? 6 : index + 2;
                                    return React.createElement("h" + nivel, {
                                        key: index,
                                        style: { marginTop: '0px' },
                                    }, /* this.getActualIndex(titles_length, index) + */text);
                                }
                                return null;
                            })
                        );
                    }

                }
            }
            if (navItem.id !== 0) {
                let hide = true;
                for (let i in toolbar) {
                    if (toolbar[i] !== 'hidden') {
                        hide = false;
                        break;
                    }
                }

                return (
                    <div className="title ediphyHeader" onClick={(e) => {
                        this.props.onBoxSelected(-1);
                        e.stopPropagation();
                    }}>
                        <div style={{
                            backgroundColor: 'transparent',
                            display: (!hide && this.props.titles.length !== 0) ? 'initial' : 'none',
                        }}>
                            {/* <div className={this.props.showButtons ? "caja selectedTitle selectedBox" : "caja"} > */}
                            <div className={"caja"}>
                                <div className="cab">

                                    <div className="cabtabla_numero"
                                        style={{ display: (toolbar.numPage === 'hidden' || !pagenumber) ? 'none' : 'block' }}
                                    >{pagenumber}</div>

                                    <div className="tit_ud_cap">
                                        {/* Course title*/}
                                        {!this.state.editingTitle ?
                                            (<h1 onClick={e => {
                                                this.setState({ editingTitle: !this.state.editingTitle });
                                                if (this.state.editingTitle) { /* Save changes to Redux state*/
                                                    this.props.onTitleChanged(this.props.courseTitle, this.state.currentTitle);
                                                    // Synchronize current component state with Redux state when entering edition mode
                                                } else {
                                                    this.setState({ currentTitle: this.props.courseTitle });
                                                }
                                                e.stopPropagation();
                                            }}
                                            style={{ display: (toolbar.courseTitle === 'hidden') ? 'none' : 'block' }}>{this.props.courseTitle}</h1>
                                            ) :
                                            (<FormControl
                                                type="text"
                                                ref="titleIndex"
                                                className={"editCourseTitle"}
                                                value={this.state.currentTitle}
                                                autoFocus
                                                onKeyDown={e=> {
                                                    if (e.keyCode === 13) { // Enter Key
                                                        this.setState({ editingTitle: !this.state.editingTitle });
                                                        this.props.onTitleChanged(this.props.courseTitle, (this.state.currentTitle.length > 0) ? this.state.currentTitle : this.getDefaultValue());
                                                    }
                                                    if (e.keyCode === 27) { // Escape key
                                                        this.setState({ editingTitle: !this.state.editingTitle });
                                                    }
                                                }}
                                                onFocus={e => {
                                                    /* Select all the content when enter edition mode*/
                                                    e.target.setSelectionRange(0, e.target.value.length);

                                                }}
                                                onChange={e => {
                                                    /* Save it on component state, not Redux*/
                                                    this.setState({ currentTitle: e.target.value });
                                                }}
                                                onBlur={e => {
                                                    /* Change to non-edition mode*/
                                                    this.setState({ editingTitle: !this.state.editingTitle });
                                                    this.props.onTitleChanged(this.props.courseTitle, (this.state.currentTitle.length > 0) ? this.state.currentTitle : this.getDefaultValue());
                                                }} />)}
                                        {/* NavItem title */}
                                        {!this.state.editingNavTitle ?
                                            (<h2 onClick={e => {
                                                this.setState({ editingNavTitle: !this.state.editingNavTitle });
                                                if (this.state.editingNavTitle) { /* Save changes to Redux state*/
                                                    this.props.onViewTitleChanged(navItem.id, { documentTitleContent: this.state.currentNavTitle });
                                                    // Synchronize current component state with Redux state when entering edition mode
                                                } else {
                                                    this.setState({ currentNavTitle: docTitle });
                                                }
                                                e.stopPropagation();
                                            }}
                                            style={{ display: (toolbar.documentTitle === 'hidden') ? 'none' : 'block' }}>{docTitle}</h2>
                                            ) :
                                            (<FormControl
                                                type="text"
                                                ref="titleNavIndex"
                                                className={"editNavTitle"}
                                                value={this.state.currentNavTitle}
                                                autoFocus
                                                onKeyDown={e=> {
                                                    if (e.keyCode === 13) { // Enter Key
                                                        this.setState({ editingNavTitle: !this.state.editingNavTitle });
                                                        this.props.onViewTitleChanged(navItem.id, { documentTitleContent: (this.state.currentNavTitle.length > 0) ? this.state.currentNavTitle : this.getDefaultValue() });
                                                    }
                                                    if (e.keyCode === 27) { // Escape key
                                                        this.setState({ editingNavTitle: !this.state.editingNavTitle });
                                                    }
                                                }}
                                                onFocus={e => {
                                                    /* Select all the content when enter edition mode*/
                                                    e.target.setSelectionRange(0, e.target.value.length);

                                                }}
                                                onChange={e => {
                                                    /* Save it on component state, not Redux*/
                                                    this.setState({ currentNavTitle: e.target.value });
                                                }}
                                                onBlur={e => {
                                                    /* Change to non-edition mode*/
                                                    this.setState({ editingNavTitle: !this.state.editingNavTitle });
                                                    this.props.onViewTitleChanged(navItem.id, { documentTitleContent: (this.state.currentNavTitle.length > 0) ? this.state.currentNavTitle : this.getDefaultValue() });
                                                }} />)}
                                        {/* Info CV */}
                                        {this.props.containedView !== 0 ?
                                            <CVInfo containedViews={this.props.containedViews}
                                                navItems={this.props.navItems}
                                                containedView={this.props.containedView}
                                                pluginToolbars={this.props.pluginToolbars}
                                                viewToolbars={this.props.viewToolbars}
                                                marks={this.props.marks}
                                                boxes={this.props.boxes}/> : null
                                        }
                                        {/* NavItem subtitle */}
                                        {!this.state.editingNavSubTitle ?
                                            (<h3 onClick={e => {
                                                this.setState({ editingNavSubTitle: !this.state.editingNavSubTitle });
                                                if (this.state.editingNavSubTitle) { /* Save changes to Redux state*/
                                                    this.props.onViewTitleChanged(navItem.id, { documentSubtitleContent: this.state.currentNavSubTitle });
                                                    // Synchronize current component state with Redux state when entering edition mode
                                                } else {
                                                    this.setState({ currentNavSubTitle: subTitle });
                                                }
                                                e.stopPropagation();
                                            }}
                                            style={{ display: (toolbar.documentSubtitle === 'hidden') ? 'none' : 'block' }}>{subTitle}</h3>
                                            ) :
                                            (<FormControl
                                                type="text"
                                                ref="SubtitleNavIndex"
                                                className={"editNavSubTitle"}
                                                value={this.state.currentNavSubTitle}
                                                autoFocus
                                                onKeyDown={e=> {
                                                    if (e.keyCode === 13) { // Enter Key
                                                        this.setState({ editingNavSubTitle: !this.state.editingNavSubTitle });
                                                        this.props.onViewTitleChanged(navItem.id, { documentSubtitleContent: (this.state.currentNavSubTitle.length > 0) ? this.state.currentNavSubTitle : this.getDefaultValue() });
                                                    }
                                                    if (e.keyCode === 27) { // Escape key
                                                        this.setState({ editingNavSubTitle: !this.state.editingNavSubTitle });
                                                    }
                                                }}
                                                onFocus={e => {
                                                    /* Select all the content when enter edition mode*/
                                                    e.target.setSelectionRange(0, e.target.value.length);

                                                }}
                                                onChange={e => {
                                                    /* Save it on component state, not Redux*/
                                                    this.setState({ currentNavSubTitle: e.target.value });
                                                }}
                                                onBlur={e => {
                                                    /* Change to non-edition mode*/
                                                    this.setState({ editingNavSubTitle: !this.state.editingNavSubTitle });
                                                    this.props.onViewTitleChanged(navItem.id, { documentSubtitleContent: (this.state.currentNavSubTitle.length > 0) ? this.state.currentNavSubTitle : this.getDefaultValue() });
                                                }} />)}
                                        {/* <h3
                                            style={{ display: (toolbar.documentSubtitle === 'hidden') ? 'none' : 'block' }}>{subTitle}</h3> */}

                                        {/* breadcrumb */}
                                        <div className="contenido"
                                            style={{ display: (toolbar.breadcrumb === 'hidden') ? 'none' : 'block' }}>
                                            {content}
                                        </div>
                                    </div>

                                    <div style={{ display: 'none' }} className="clear"/>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            }
        }
        return null;

    }

    /** *
     * This method is used to calculate actual position for title indexes
     * It makes use of the array of titles, the current position in the iteration, and the level stored in nav properties
     * @param size
     * @param level
     * @returns {*} Index
     */
    getActualIndex(size = 1, level = 0) {
        // Default values are stored in this variables
        let actual_parent = this.props.navItems[this.props.navItem.parent];
        let actual_level = this.props.navItem;
        // Equal size to the index of level
        size = size - 1;

        if (size === undefined || level === undefined || this.props.titles.length === 0) {
            // This happens when you are in a root element

            return "";

        } else if (size === level) {
            // This happens when you are in the first level
            let actual_index = (actual_parent.children.indexOf(actual_level.id));
            if (actual_index !== -1) {
                return (actual_index + 1) + ". ";
            }
        } else {
            // This happens when you have several sections in the array
            // You iterate inversely in the array until you get to the level stored in nav properties
            let actual_index;
            let interating_level = level + 1;

            for (let n = actual_level.level; interating_level < n; n--) {
                actual_level = actual_parent;
                actual_parent = this.props.navItems[actual_level.parent];
            }

            let final_level = actual_parent.children.indexOf(actual_level.id) + 1;
            if (actual_parent !== undefined && actual_parent.children !== undefined) {
                return final_level + ". ";
            }
            return "";

        }
        return "";
    }

}

EditorHeader.propTypes = {
    /**
     * Object containing view titles
     */
    titles: PropTypes.array.isRequired,
    /**
     * Callback for selecting a box
     */
    onBoxSelected: PropTypes.func.isRequired,
    /**
     * Current view (by ID)
     */
    navItem: PropTypes.any,
    /**
     * Object containing all views (by id)
     */
    navItems: PropTypes.object.isRequired,
    /**
     * Current contained view (by ID)
     */
    containedView: PropTypes.any,
    /**
     * Object containing all contained views (identified by its ID)
     */
    containedViews: PropTypes.object.isRequired,
    /**
     *  Object containing all created boxes (by id)
     */
    boxes: PropTypes.object.isRequired,
    /**
     * Callback for modify course title
     */
    onTitleChanged: PropTypes.func.isRequired,
    /**
     * Callback for modify navitem title and subtitle
     */
    onViewTitleChanged: PropTypes.func.isRequired,
    /**
     * Object containing all the navitem toolbars (by navitem ID)
     */
    viewToolbars: PropTypes.object.isRequired,
    /**
     * Object containing box marks
     */
    marks: PropTypes.object,
    /**
     * Course title
     */
    courseTitle: PropTypes.string,
    /**
       * Plugin toolbars
       */
    pluginToolbars: PropTypes.object,
};
