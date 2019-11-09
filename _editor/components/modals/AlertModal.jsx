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
        const { marksById, markInfo, viewToolbarsById } = this.props;
        const mark = marksById[markInfo];
        const cvId = mark ? mark.connection : 0;

        const confirmText = viewToolbarsById.hasOwnProperty(cvId) && viewToolbarsById[cvId].viewName ?
            i18n.t("messages.confirm_delete_CV_also_1") + viewToolbarsById[cvId].viewName + i18n.t("messages.confirm_delete_CV_also_2")
            : '';

        return(

            this.props.showCVAlert ?
                <Alert className="pageModal"
                    show={this.props.showCVAlert}
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
        const { boxesById, containedViewsById, marksById, markInfo } = this.props;
        const mark = marksById[markInfo];
        const cvId = mark ? mark.connection : 0;
        if (bool && mark) {
            this.props.dispatch(deleteRichMark(mark));
            let deleteAlsoCV = document.getElementById('deleteAlsoCv').classList.toString().indexOf('checked') > 0;
            if(deleteAlsoCV) {
                let boxesRemoving = [];
                this.props.containedViewsById[cvId].boxes.map(boxId => {
                    boxesRemoving.push(boxId);
                    boxesRemoving = boxesByIdRemoving.concat(getDescendantBoxes(boxes[boxId], boxesById));
                });

                this.props.dispatch(deleteContainedView([cvId], boxesRemoving, containedViewsById[cvId]));
            }
        } else {

        }
        this.props.dispatch(updateUI({ showCVAlert: false }));

    };
}

function mapStateToProps(state) {
    const { boxesById, containedViewsById, marksById, viewToolbarsById } = state.undoGroup.present;
    const { showCVAlert, markInfo } = state.reactUI;
    return {
        marksById,
        viewToolbarsById,
        containedViewsById,
        boxesById,
        showCVAlert,
        markInfo,
    };
}

export default connect(mapStateToProps)(AlertModal);

AlertModal.propTypes = {
    /**
     *  Object containing all created boxes (by id)
     */
    boxesById: PropTypes.object.isRequired,
    /**
     * Redux actions dispatcher
     */
    dispatch: PropTypes.func.isRequired,
    /**
     * Object containing box marksById
     */
    marksById: PropTypes.object,
    /**
     * Id of mark to be deleted
     */
    markInfo: PropTypes.string,
    /**
     * Show CV alert
     */
    showCVAlert: PropTypes.bool,
    /**
     * Object containing every view toolbar (by id)
     */
    viewToolbarsById: PropTypes.object.isRequired,
    /**
     * Object containing all contained views (by id)
     */
    containedViewsById: PropTypes.object.isRequired,
};
