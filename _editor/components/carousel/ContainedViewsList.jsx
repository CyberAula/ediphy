import React, { Component } from 'react';
import i18n from "i18next";
import PropTypes from "prop-types";

import { isSlide } from "../../../common/utils";
import EditorIndexTitle from "./editorIndexTitle/EditorIndexTitle";

export default class ContainedViewsList extends Component {

    render() {

        const { containedViewsById, showContainedViews, showSortableItems, indexSelected, containedViewSelected, viewToolbarsById, onIndexSelected } = this.props;
        const { onContainedViewNameChanged, onContainedViewSelected } = this.props.handleContainedViews;

        let containedViewsByIdIncluded = Object.keys(containedViewsById).length > 0;
        return (<div className="containedViewsByIdList" style={{ height: (showContainedViews) ? ((showSortableItems) ? "calc(50% - 126px)" : "calc(100% - 126px)") : "0px",
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
                                    onContainedViewSelected(id);
                                    e.stopPropagation();
                                }}
                                onMouseDown={() => {
                                    onIndexSelected(id);
                                }}>
                                <i className="material-icons fileIcon">{isSlide(containedViewsById[id].type) ? "slideshow" : "insert_drive_file"}</i>
                                <EditorIndexTitle
                                    id={id}
                                    title={viewToolbarsById[id].viewName}
                                    index={1}
                                    hidden={false}
                                    selected = {containedViewSelected}
                                    onNameChanged={onContainedViewNameChanged} />
                            </div>
                        </div>
                    );
                })
            }

        </div>);

    }
}

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
     * Collection of callbacks for contained views handling
     */
    handleContainedViews: PropTypes.object.isRequired,
    /**
     * Callback for renaming view
     */
    onIndexSelected: PropTypes.func.isRequired,
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
