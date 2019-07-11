import React, { Component } from 'react';
import { connect } from "react-redux";
import PropTypes from 'prop-types';
import { ActionCreators } from 'redux-undo';
import printToPDF from "../../../../core/editor/print";
import { isSortableBox } from "../../../../common/utils";
import { updateUI } from "../../../../common/actions";

class KeyListener extends Component {

    render() {
        return null;
    }

    componentDidMount() {
        document.addEventListener('keydown', this.keyListener);
    }

    componentWillUnmount() {
        document.removeEventListener('keydown', this.keyListener);
    }

    keyListener = (e) => {
        let key = e.keyCode ? e.keyCode : e.which;
        if (key === 9) {
            e.preventDefault();
            return;
        }
        // Checks what element has the cursor focus currently
        let focus = document.activeElement.className;
        let notText = (!document.activeElement.type || focus.indexOf('rib') !== -1) && focus.indexOf('form-control') === -1 && focus.indexOf('tituloCurso') === -1 && focus.indexOf('cke_editable') === -1;

        // Ctrl + Z
        if (key === 90 && e.ctrlKey) {
            if (notText) {
                this.props.dispatch(ActionCreators.undo());
            }
        }
        // Ctrl + Y
        if (key === 89 && e.ctrlKey) {
            if (notText) {
                this.props.dispatch(ActionCreators.redo());
            }
        }
        // Ctrl + A
        if (key === 192 && e.ctrlKey) {
            this.handleNavItems.onNavItemDuplicated(this.props.navItemSelected);
        }

        if (key === 80 && e.ctrlKey && e.shiftKey) {
            e.cancelBubble = true;
            e.preventDefault();

            e.stopImmediatePropagation();
            printToPDF(this.props.fullState, (b)=>{if(b) {alert('Error');}});
        }

        // Supr
        else if (key === 46 || key === 8) {
            if (this.props.boxSelected !== -1 && !isSortableBox(this.props.boxSelected)) {
                // If it is not an input or any other kind of text edition AND there is a box selected, it deletes said box
                if (notText) {
                    let box = this.props.boxes[this.props.boxSelected];
                    let toolbar = this.props.pluginToolbars[this.props.boxSelected];
                    if (!toolbar.showTextEditor) {
                        this.handleBoxes.onBoxDeleted(box.id, box.parent, box.container, this.props.containedViewSelected && this.props.containedViewSelected !== 0 ? this.props.containedViewSelected : this.props.navItemSelected);
                    }
                }
            }
        }

        if (key === 112) {
            e.preventDefault();
            this.props.dispatch(updateUI({ showHelpButton: true }));
        }
        if (key === 113) {
            e.preventDefault();
            this.props.dispatch(updateUI({ visorVisible: true }));
        }
    };

}

function mapStateToProps(state) {
    return {
        pluginToolbars: state.undoGroup.present.pluginToolbarsById,
        boxSelected: state.undoGroup.present.boxSelected,
        boxes: state.undoGroup.present.boxesById,
        containedViewSelected: state.undoGroup.present.containedViewSelected,
        navItemSelected: state.undoGroup.present.navItemSelected,
        fullState: state.undoGroup.present,
    };
}

export default connect(mapStateToProps)(KeyListener);

KeyListener.propTypes = {
    /**
     * Selected box
     */
    boxSelected: PropTypes.any,
    /**
     * Current selected view (by ID)
     */
    navItemSelected: PropTypes.any,
    /**
     * Plugin toolbars
     */
    pluginToolbars: PropTypes.object,
};
