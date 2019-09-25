import React, { Component } from 'react';
import i18n from "i18next";
import PropTypes from "prop-types";
import { connect } from 'react-redux';

import { isSlide } from "../../../common/utils";
import EditorIndexTitle from "./editorIndexTitle/EditorIndexTitle";
import _handlers from "../../handlers/_handlers";

class ContainedViewsList extends Component {
    h = _handlers(this);

    render() {

        const { containedViewsById, showContainedViews, showSortableItems, indexSelected, containedViewSelected, viewToolbarsById } = this.props;

        let containedViewsByIdIncluded = Object.keys(containedViewsById).length > 0;
        return (<div className="containedViewsList" style={{ height: (showContainedViews) ? ((showSortableItems) ? "calc(50% - 126px)" : "calc(100% - 126px)") : "0px",
            display: 'block', overflowY: 'auto', overflowX: 'hidden' }}>
            <div className="empty-info" style={{ display: (containedViewsByIdIncluded) ? "none" : "block" }}>{i18n.t("empty.cv_empty")}</div>

            {
                Object.keys(containedViewsById).map((id)=>{
                    let classIndexSelected = id === indexSelected ? ' classIndexSelected ' : ' ';
                    let isContainedViewSelected = id === containedViewSelected ? ' selected ' : ' ';
                    return (
                        <div className={"carousselContainer " + isContainedViewSelected } key={id}>
                            <div key={id}
                                className={'file navItemBlock ' + classIndexSelected }
                                onDoubleClick={e => {
                                    this.h.onContainedViewSelected(id);
                                    e.stopPropagation();
                                }}
                                onMouseDown={() => this.h.onIndexSelected(id)}>
                                <i className="material-icons fileIcon">{isSlide(containedViewsById[id].type) ? "slideshow" : "insert_drive_file"}</i>
                                <EditorIndexTitle
                                    id={id}
                                    title={viewToolbarsById[id].viewName}
                                    index={1}
                                    hidden={false}
                                    selected = {containedViewSelected}
                                    onNameChanged={this.h.onContainedViewNameChanged} />
                            </div>
                        </div>
                    );
                })
            }

        </div>);

    }
}

function mapStateToProps(state) {
    const { containedViewsById, containedViewSelected, viewToolbarsById } = state.undoGroup.present;
    return {
        containedViewsById,
        containedViewSelected,
        viewToolbarsById,
    };
}

export default connect(mapStateToProps)(ContainedViewsList);

ContainedViewsList.propTypes = {
    /**
     *  Object containing all contained views (identified by its ID)
     */
    containedViewsById: PropTypes.object.isRequired,
    /**
     * Selected contained view
     */
    containedViewSelected: PropTypes.any,
    /**
     * View/Contained view selected at the index
     */
    indexSelected: PropTypes.any,
    /**
     * Object containing all the pages' toolbars
     */
    viewToolbarsById: PropTypes.object.isRequired,
    /**
     * Indicates if contained views should be displayed
     */
    showContainedViews: PropTypes.bool.isRequired,
    /**
     * Indicates if sortable items should be displayed
     */
    showSortableItems: PropTypes.bool.isRequired,
};
