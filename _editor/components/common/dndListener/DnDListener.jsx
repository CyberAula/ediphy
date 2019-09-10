import React from 'react';
import { connect } from "react-redux";
import PropTypes from 'prop-types';

import { updateUI } from "../../../../common/actions";

class DnDListener extends React.Component {

    render() {
        return null;
    }

    componentDidMount() {
        document.addEventListener('dragover', this.handleDnD.dragListener);
        document.addEventListener('dragleave', this.handleDnD.dragExitListener);
        document.addEventListener('drop', this.handleDnD.dropListener);
        document.addEventListener('dragstart', this.handleDnD.dragStartListener);
    }

    componentWillUnmount() {
        document.removeEventListener('dragover', this.handleDnD.dragListener);
        document.removeEventListener('dragleave', this.handleDnD.dragExitListener);
        document.removeEventListener('drop', this.handleDnD.dropListener);
        document.removeEventListener('dragstart', this.handleDnD.dragStartListener);
    }

    handleDnD = {

        dragExitListener: (ev) => {
            ev.preventDefault();
            if (ev.target.parentNode && ev.target.parentNode.classList.contains('fileInput')) {
                ev.target.parentNode.classList.remove('dragging');
            }
        },

        dragListener: (ev) => {
            let { showFileUpload, blockDrag, fileUploadTab } = this.props;
            if (!showFileUpload && !blockDrag) {
                this.props.dispatch(updateUI({
                    showFileUpload: '*',
                    fileModalResult: { id: undefined, value: undefined },
                    fileUploadTab: 0,
                }));
            }
            if (showFileUpload && fileUploadTab !== 0) {
                this.props.dispatch(updateUI({ fileUploadTab: 0 }));
            }
            ev.preventDefault();
            if (ev.target.parentNode && ev.target.parentNode.classList.contains('fileInput')) {
                ev.target.parentNode.classList.add('dragging');
            }
        },

        dragStartListener: () => this.props.dispatch(updateUI({ blockDrag: true })),

        dropListener: (ev) => {
            if (ev.target.tagName === 'INPUT' && ev.target.type === 'file') {
            } else {
                ev.preventDefault();
            }
            this.props.dispatch(updateUI({ blockDrag: false }));
        },
    };

}

function mapStateToProps(state) {
    return {
        showFileUpload: state.reactUI.showFileUpload,
        blockDrag: state.reactUI.blockDrag,
        fileUploadTab: state.reactUI.fileUploadTab,
    };
}

export default connect(mapStateToProps)(DnDListener);

DnDListener.propTypes = {
    /**
     * Block drag
     */
    blockDrag: PropTypes.bool,
    /**
     * Redux actions dispatcher
     */
    dispatch: PropTypes.func.isRequired,
    /**
     * File upload section
     */
    fileUploadTab: PropTypes.number,
    /**
     * Show File upload modal
     */
    showFileUpload: PropTypes.bool,
};
