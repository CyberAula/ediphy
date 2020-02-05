import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Breadcrumb, BreadcrumbItem } from 'react-bootstrap';
import i18n from 'i18next';
import CVInfo from "./CVInfo";
import { connect } from "react-redux";
import _handlers from "../../../handlers/_handlers";
import { BreadCrumb, Cab, CabTableNumber, EditCourseTitle, EditNavSubtitle, EditNavTitle, TitleBox, Title } from "./Styles";

/**
 *  EditorHeaderComponent
 *  It shows the current page's title
 */
class EditorHeader extends Component {
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
        this.h = _handlers(this);
    }
    render() {
        const { containedViewSelected, containedViewsById, courseTitle, navItemSelected, navItemsById, titles, viewToolbarsById } = this.props;

        if (navItemSelected || containedViewSelected) {
            let currentNavItem = containedViewSelected !== 0 ? containedViewsById[containedViewSelected] : navItemsById[navItemSelected];
            let toolbar = viewToolbarsById[currentNavItem.id] ?? undefined;

            let docTitle, subTitle, pagenumber = "";

            if (currentNavItem.id !== 0 && toolbar) {
                docTitle = (toolbar.documentTitle !== "" && (toolbar.documentTitleContent !== "")) ? toolbar.documentTitleContent : toolbar.viewName;
                subTitle = toolbar.documentSubtitle !== "" && (toolbar.documentSubtitleContent !== i18n.t('subtitle')) ? toolbar.documentSubtitleContent : i18n.t('subtitle');
                pagenumber = toolbar.numPageContent !== "" ? toolbar.numPageContent : "";
            }

            let content;
            // breadcrumb
            if (containedViewSelected === 0) {
                if (toolbar !== undefined) {
                    if (toolbar.breadcrumb === 'reduced') {
                        let titleList = this.props.titles;
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
                        content = React.createElement("div", { className: "subheader" },
                            titles.map((text, index) => {
                                if (index === 0) {
                                } else {
                                    let nivel = (index > 4) ? 6 : index + 2;
                                    return React.createElement("h" + nivel, {
                                        key: index,
                                        style: { marginTop: '0px' },
                                    }, text);
                                }
                                return null;
                            })
                        );
                    }

                }
            }
            if (currentNavItem.id !== 0) {
                let hide = true;

                for (let i in toolbar) {
                    if (toolbar[i] !== 'hidden') {
                        hide = false;
                        break;
                    }
                }
                let classes = this.props.isDoc ? "title ediphyHeader canvasDoc" : "title ediphyHeader";
                return (
                    <Title className={classes} onClick={e => {
                        this.h.onBoxSelected(-1);
                        e.stopPropagation();
                    }}>
                        <div style={{
                            backgroundColor: 'transparent',
                            display: (!hide && titles.length !== 0) ? 'initial' : 'none',
                        }}>
                            {/* <div className={this.props.showButtons ? "caja selectedTitle selectedBox" : "caja"} > */}
                            <TitleBox>
                                <Cab>
                                    <CabTableNumber hide={toolbar.numPage === 'hidden' || !pagenumber} children={pagenumber}/>
                                    <div className="tit_ud_cap">
                                        {/* Course title*/}
                                        {!this.state.editingTitle ?
                                            (<h1 onClick={e => {
                                                this.setState({ editingTitle: !this.state.editingTitle });
                                                if (this.state.editingTitle) { /* Save changes to Redux state*/
                                                    this.h.onTitleChanged(courseTitle, this.state.currentTitle);
                                                    // Synchronize current component state with Redux state when entering edition mode
                                                } else {
                                                    this.setState({ currentTitle: courseTitle });
                                                }
                                                e.stopPropagation();
                                            }}
                                            style={{ display: (toolbar.courseTitle === 'hidden') ? 'none' : 'block' }}>{courseTitle}</h1>
                                            ) :
                                            (<EditCourseTitle
                                                type="text"
                                                ref="titleIndex"
                                                value={this.state.currentTitle}
                                                autoFocus
                                                onKeyDown={e=> {
                                                    if (e.keyCode === 13) { // Enter Key
                                                        this.setState({ editingTitle: !this.state.editingTitle });
                                                        this.h.onTitleChanged(courseTitle, (this.state.currentTitle.length > 0) ? this.state.currentTitle : this.getDefaultValue());
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
                                                onBlur={() => {
                                                    /* Change to non-edition mode*/
                                                    this.setState({ editingTitle: !this.state.editingTitle });
                                                    this.h.onTitleChanged(courseTitle, (this.state.currentTitle.length > 0) ? this.state.currentTitle : this.getDefaultValue());
                                                }} />)}
                                        {/* NavItem title */}
                                        {!this.state.editingNavTitle ?
                                            (<h2 onClick={e => {
                                                this.setState({ editingNavTitle: !this.state.editingNavTitle });
                                                if (this.state.editingNavTitle) { /* Save changes to Redux state*/
                                                    this.h.onViewTitleChanged(currentNavItem.id, { documentTitleContent: this.state.currentNavTitle });
                                                    // Synchronize current component state with Redux state when entering edition mode
                                                } else {
                                                    this.setState({ currentNavTitle: docTitle });
                                                }
                                                e.stopPropagation();
                                            }}
                                            style={{ display: (toolbar.documentTitle === 'hidden') ? 'none' : 'block' }}>{docTitle}</h2>
                                            ) :
                                            (<EditNavTitle
                                                type="text"
                                                ref="titleNavIndex"
                                                value={this.state.currentNavTitle}
                                                autoFocus
                                                onKeyDown={e=> {
                                                    if (e.keyCode === 13) { // Enter Key
                                                        this.setState({ editingNavTitle: !this.state.editingNavTitle });
                                                        this.h.onViewTitleChanged(currentNavItem.id, { documentTitleContent: (this.state.currentNavTitle.length > 0) ? this.state.currentNavTitle : this.getDefaultValue() });
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
                                                onBlur={() => {
                                                    /* Change to non-edition mode*/
                                                    this.setState({ editingNavTitle: !this.state.editingNavTitle });
                                                    this.h.onViewTitleChanged(currentNavItem.id, { documentTitleContent: (this.state.currentNavTitle.length > 0) ? this.state.currentNavTitle : this.getDefaultValue() });
                                                }} />)}
                                        {containedViewSelected !== 0 && <CVInfo/>}
                                        {!this.state.editingNavSubTitle ?
                                            (<h3 onClick={e => {
                                                this.setState({ editingNavSubTitle: !this.state.editingNavSubTitle });
                                                if (this.state.editingNavSubTitle) { /* Save changes to Redux state*/
                                                    this.h.onViewTitleChanged(currentNavItem.id, { documentSubtitleContent: this.state.currentNavSubTitle });
                                                    // Synchronize current component state with Redux state when entering edition mode
                                                } else {
                                                    this.setState({ currentNavSubTitle: subTitle });
                                                }
                                                e.stopPropagation();
                                            }}
                                            style={{ display: (toolbar.documentSubtitle === 'hidden') ? 'none' : 'block' }}>{subTitle}</h3>
                                            ) :
                                            (<EditNavSubtitle
                                                type="text"
                                                ref="SubtitleNavIndex"
                                                value={this.state.currentNavSubTitle}
                                                autoFocus
                                                onKeyDown={e=> {
                                                    if (e.keyCode === 13) { // Enter Key
                                                        this.setState({ editingNavSubTitle: !this.state.editingNavSubTitle });
                                                        this.h.onViewTitleChanged(currentNavItem.id, { documentSubtitleContent: (this.state.currentNavSubTitle.length > 0) ? this.state.currentNavSubTitle : this.getDefaultValue() });
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
                                                onBlur={() => {
                                                    /* Change to non-edition mode*/
                                                    this.setState({ editingNavSubTitle: !this.state.editingNavSubTitle });
                                                    this.h.onViewTitleChanged(currentNavItem.id, { documentSubtitleContent: (this.state.currentNavSubTitle.length > 0) ? this.state.currentNavSubTitle : this.getDefaultValue() });
                                                }} />)}
                                        <BreadCrumb doc={this.props.isDoc} hide={toolbar.breadcrumb === 'hidden'} children={content}/>
                                    </div>

                                    <div style={{ display: 'none' }} className="clear"/>
                                </Cab>
                            </TitleBox>
                        </div>
                    </Title>
                );
            }
        }
        return null;
    }
}

function mapStateToProps(state) {
    const { navItemsById, navItemSelected, containedViewsById, containedViewSelected, boxesById, viewToolbarsById, marksById, pluginToolbarsById } = state.undoGroup.present;
    return {
        navItemsById,
        navItemSelected,
        containedViewSelected,
        containedViewsById,
        boxesById,
        viewToolbarsById,
        marksById,
        pluginToolbarsById,
    };
}

export default connect(mapStateToProps)(EditorHeader);

EditorHeader.propTypes = {
    /**
     * Current view is a document
     */
    isDoc: PropTypes.any,
    /**
     * Object containing view titles
     */
    titles: PropTypes.array.isRequired,
    /**
     * Current view (by ID)
     */
    navItemSelected: PropTypes.any,
    /**
     * Object containing all views (by id)
     */
    navItemsById: PropTypes.object.isRequired,
    /**
     * Current contained view (by ID)
     */
    containedViewSelected: PropTypes.any,
    /**
     * Object containing all contained views (identified by its ID)
     */
    containedViewsById: PropTypes.object.isRequired,
    /**
     * Object containing all the navitem toolbars (by navitem ID)
     */
    viewToolbarsById: PropTypes.object.isRequired,
    /**
     * Course title
     */
    courseTitle: PropTypes.string,
};
