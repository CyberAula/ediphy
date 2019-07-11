import React from 'react';
import PropTypes from 'prop-types';
import i18n from "i18next";
import { connect } from "react-redux";
import Alert from "../common/alert/Alert";
import Cookies from 'universal-cookie';
import { deleteContainedView, deleteRichMark, updateUI } from "../../../common/actions";
import { getDescendantBoxes } from "../../../common/utils";
import ToggleSwitch from "@trendmicro/react-toggle-switch";

const cookies = new Cookies();

class AlertModal extends React.Component {

    state = {
        initModal: cookies.get("ediphy_visitor") === undefined,
    };

    render() {
        let confirmText = "";
        try {
            confirmText = i18n.t("messages.confirm_delete_CV_also_1") + this.props.viewToolbars[ this.props.marks[this.props.markInfo].connection].viewName + i18n.t("messages.confirm_delete_CV_also_2");
        } catch (e) {
        }

        return(
            this.props.show ?
                <Alert className="pageModal"
                    show={this.props.show}
                    hasHeader
                    title={<span><i style={{ fontSize: '14px', marginRight: '5px' }} className="material-icons">delete</i>{i18n.t("messages.confirm_delete_cv")}</span>}
                    cancelButton
                    acceptButtonText={i18n.t("messages.OK")}
                    onClose={(bool)=>{
                        if (bool) {
                            this.props.dispatch(deleteRichMark(this.props.marks[this.props.markInfo]));
                            let deleteAlsoCV = document.getElementById('deleteAlsoCv').classList.toString().indexOf('checked') > 0;
                            if(deleteAlsoCV) {
                                let boxesRemoving = [];
                                this.props.containedViews[ this.props.marks[this.mark.info].connection].boxes.map(boxId => {
                                    boxesRemoving.push(boxId);
                                    boxesRemoving = boxesRemoving.concat(getDescendantBoxes(this.props.boxes[boxId], this.props.boxes));
                                });

                                this.props.dispatch(deleteContainedView([this.props.marks[this.props.markInfo].connection], boxesRemoving, selfcv.parent));
                            }
                        } else {

                        }
                        this.props.dispatch(updateUI({ showCVAlert: false }));

                    }}>
                    <span> {confirmText} </span><br/>
                    <ToggleSwitch id="deleteAlsoCv" style={{ margin: '10px' }}/>
                    {i18n.t("messages.confirm_delete_cv_as_well")}
                </Alert> : null
        );
    }
}

function mapStateToProps(state) {
    return {
        marks: state.undoGroup.present.marksById,
        viewToolbars: state.undoGroup.present.viewToolbarsById,
    };
}

export default connect(mapStateToProps)(AlertModal);

AlertModal.propTypes = {
    /**
     * Show init tour
     */
    showTour: PropTypes.func,
};
