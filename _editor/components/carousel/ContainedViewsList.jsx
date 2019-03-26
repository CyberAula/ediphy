import React, { Component } from 'react';
import i18n from "i18next";
import { isSlide } from "../../../common/utils";
import EditorIndexTitle from "./editor_index_title/EditorIndexTitle";

export default class ContainedViewsList extends Component {

    render() {
        let containedViewsIncluded = Object.keys(this.props.containedViews).length > 0;
        return (<div className="containedViewsList" style={{ height: (this.props.showContainedViews) ? ((this.props.showSortableItems) ? "calc(50% - 126px)" : "calc(100% - 126px)") : "0px",
            display: 'block', overflowY: 'auto', overflowX: 'hidden' }}>
            <div className="empty-info" style={{ display: (containedViewsIncluded) ? "none" : "block" }}>{i18n.t("empty.cv_empty")}</div>

            {
                Object.keys(this.props.containedViews).map((id, key)=>{
                    let classIndexSelected = id === this.props.indexSelected ? ' classIndexSelected ' : ' ';
                    let containedViewSelected = id === this.props.containedViewSelected ? ' selected ' : ' ';
                    return (
                        <div className={"carousselContainer " + containedViewSelected } key={id}>
                            <div key={id}
                                className={'file navItemBlock ' + classIndexSelected }
                                onDoubleClick={e => {
                                    this.props.onContainedViewSelected(id);
                                    e.stopPropagation();
                                }}
                                onMouseDown={e => {
                                    this.props.onIndexSelected(id);
                                    // e.stopPropagation();
                                }}>
                                <i className="material-icons fileIcon">{isSlide(this.props.containedViews[id].type) ? "slideshow" : "insert_drive_file"}</i>
                                <EditorIndexTitle
                                    id={id}
                                    title={this.props.viewToolbars[id].viewName}
                                    index={1}
                                    hidden={false}
                                    selected = {this.props.containedViewSelected}
                                    onNameChanged={this.props.onContainedViewNameChanged} />
                            </div>
                        </div>
                    );
                })
            }

        </div>);

    }
}
