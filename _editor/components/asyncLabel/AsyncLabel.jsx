import React, { Component } from 'react';
import i18n from 'i18next';
import PropTypes from 'prop-types';
import { connect } from "react-redux";

class AsyncLabel extends Component {
    render() {
        return (
            <div className="savingLabel"
                style={{ display: this.props.asyncLabel ? 'block' : 'none' }}>{i18n.t('messages.loading')}
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        asyncLabel: state.reactUI.asyncLabel,
    };
}

AsyncLabel.propTypes = {
    /**
   * Shows loading label
   */
    asyncLabel: PropTypes.bool,

};
export default connect(mapStateToProps)(AsyncLabel);
