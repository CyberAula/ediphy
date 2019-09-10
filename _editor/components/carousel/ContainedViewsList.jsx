import React, { Component } from 'react';
import i18n from "i18next";
import PropTypes from "prop-types";

import { isSlide } from "../../../common/utils";
import EditorIndexTitle from "./editorIndexTitle/EditorIndexTitle";

export default class ContainedViewsList extends Component {

    render() {

        const { containedViews, showContainedViews, showSortableItems, indexSelected, containedViewSelected, viewToolbars, onIndexSelected } = this.props;
        const { onContainedViewNameChanged, onContainedViewSelected } = this.props.handleContainedViews;

        let containedViewsIncluded = Object.keys(containedViews).length > 0;
        return (<div className="containedViewsList" style={{ height: (showContainedViews) ? ((showSortableItems) ? "calc(50% - 126px)" : "calc(100% - 126px)") : "0px",
            display: 'block', overflowY: 'auto', overflowX: 'hidden' }}>
            <div className="empty-info" style={{ display: (containedViewsIncluded) ? "none" : "block" }}>{i18n.t("empty.cv_empty")}</div>

            {
                Object.keys(containedViews).map((id)=>{
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
                                <i className="material-icons fileIcon">{isSlide(containedViews[id].type) ? "slideshow" : "insert_drive_file"}</i>
                                <EditorIndexTitle
                                    id={id}
                                    title={viewToolbars[id].viewName}
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
    containedViews: PropTypes.object.isRequired,
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
    viewToolbars: PropTypes.object.isRequired,
    /**
     * Indicates if contained views should be displayed
     */
    showContainedViews: PropTypes.bool.isRequired,
    /**
     * Indicates if sortable items should be displayed
     */
    showSortableItems: PropTypes.bool.isRequired,
};
