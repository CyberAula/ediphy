import React from 'react';
import PropTypes from 'prop-types';
import i18n from "i18next";
import { connect } from "react-redux";
import Alert from "../common/alert/Alert";
import { deleteContainedView, deleteRichMark, updateUI } from "../../../common/actions";
import { getDescendantBoxes } from "../../../common/utils";
import ToggleSwitch from "@trendmicro/react-toggle-switch";

class AlertModal extends React.Component {
    render() {
        const { marks, markInfo, viewToolbars } = this.props;
        const mark = marks[markInfo];
        const cvId = mark ? mark.connection : 0;

        const confirmText = viewToolbars.hasOwnProperty(cvId) && viewToolbars[cvId].viewName ?
            i18n.t("messages.confirm_delete_CV_also_1") + viewToolbars[cvId].viewName + i18n.t("messages.confirm_delete_CV_also_2")
            : '';

        return(

            this.props.show ?
                <Alert className="pageModal"
                    show={this.props.show}
                    hasHeader
                    title={
                        <span>
                            <i style={{ fontSize: '14px', marginRight: '5px' }}
                                className="material-icons">delete
                            </i>
                            {i18n.t("messages.confirm_delete_cv")}
                        </span>}
                    cancelButton
                    acceptButtonText={i18n.t("messages.OK")}
                    onClose={this.close}>
                    <span> {confirmText} </span><br/>
                    <ToggleSwitch id="deleteAlsoCv" style={{ margin: '10px' }}/>
                    {i18n.t("messages.confirm_delete_cv_as_well")}
                </Alert> : null
        );
    }

    close = (bool) => {
        const { boxes, containedViews, marks, markInfo } = this.props;
        const mark = marks[markInfo];
        const cvId = mark ? mark.connection : 0;
        if (bool && mark) {
            this.props.dispatch(deleteRichMark(mark));
            let deleteAlsoCV = document.getElementById('deleteAlsoCv').classList.toString().indexOf('checked') > 0;
            if(deleteAlsoCV) {
                let boxesRemoving = [];
                this.props.containedViews[cvId].boxes.map(boxId => {
                    boxesRemoving.push(boxId);
                    boxesRemoving = boxesRemoving.concat(getDescendantBoxes(boxes[boxId], boxes));
                });

                this.props.dispatch(deleteContainedView([cvId], boxesRemoving, containedViews[cvId]));
            }
        } else {

        }
        this.props.dispatch(updateUI({ showCVAlert: false }));

    };
}

function mapStateToProps(state) {
    return {
        marks: state.undoGroup.present.marksById,
        viewToolbars: state.undoGroup.present.viewToolbarsById,
        containedViews: state.undoGroup.present.containedViewsById,
        boxes: state.undoGroup.present.boxesById,
        show: state.reactUI.showCVAlert,
        markInfo: state.reactUI.markInfo,
    };
}

export default connect(mapStateToProps)(AlertModal);

AlertModal.propTypes = {
    /**
     *  Object containing all created boxes (by id)
     */
    boxes: PropTypes.object.isRequired,
    /**
     * Redux actions dispatcher
     */
    dispatch: PropTypes.func.isRequired,
    /**
     * Object containing box marks
     */
    marks: PropTypes.object,
    /**
     * Id of mark to be deleted
     */
    markInfo: PropTypes.string,
    /**
     * Show CV alert
     */
    show: PropTypes.bool,
    /**
     * Object containing every view toolbar (by id)
     */
    viewToolbars: PropTypes.object.isRequired,
    /**
     * Object containing all contained views (by id)
     */
    containedViews: PropTypes.object.isRequired,
};
