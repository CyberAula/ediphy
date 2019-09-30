import React from 'react';
import { connect } from 'react-redux';

import ErrorStackParser from 'error-stack-parser';
import Ediphy from '../../core/editor/main';
import PropTypes from "prop-types";

class ErrorBoundary extends React.Component {
    state = { hasError: false };

    componentDidCatch(error) {
        this.setState({ hasError: true });
        let parsed = ErrorStackParser.parse(error)[0];

        const parsedError = {
            fn: parsed.functionName,
            line: parsed.lineNumber,
            error: error.toString(),
            date: new Date().toString(),
            version: Ediphy.Config.version,
            context: this.props.context,
            state: this.props.state,
            action: this.props.lastActionDispatched,
            browser: get_browser(),
        };

        const url = process.env.CRASH_SERVICE;

        if (url) {
            fetch(url, {
                method: 'POST', // or 'PUT'
                body: JSON.stringify(parsedError), // data can be `string` or {object}!
                headers: { 'Content-Type': 'application/json' },
                mode: 'no-cors',
            }).then(res => res.json())
            // eslint-disable-next-line no-console
                .catch(err => console.error('Error:', err))
                // eslint-disable-next-line no-console
                .then(response => console.log('Success:', response));
        }
    }

    render() {
        let errorView = (<div className={"errorView"}>
            <span><i className="material-icons errorIcon">error</i> Something went wrong</span>
            <p>Please refresh page</p>
        </div>);
        return this.state.hasError ? errorView : this.props.children;
    }
}

function get_browser() {
    let ua = navigator.userAgent, tem, M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
    if((/trident/i).test(M[1])) {
        tem = (/\brv[ :]+(\d+)/g).exec(ua) || [];
        return { name: 'IE', version: (tem[1] || '') };
    }
    if(M[1] === 'Chrome') {
        tem = ua.match(/\bOPR|Edge\/(\d+)/);
        if(tem !== null) {return { name: 'Opera', version: tem[1] };}
    }
    M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
    if((tem = ua.match(/version\/(\d+)/i)) !== null) {M.splice(1, 1, tem[1]);}
    return {
        name: M[0],
        version: M[1],
    };
}

function mapStateToProps(state) {
    return {
        state: state,
        lastActionDispatched: state.undoGroup.present.lastActionDispatched,
    };
}

export default connect(mapStateToProps)(ErrorBoundary);

ErrorBoundary.propTypes = {
    /**
     * Whole state
     */
    state: PropTypes.object.isRequired,
    /**
     * Last redux action dispatched
     */
    lastActionDispatched: PropTypes.any.isRequired,
    /**
     * Error boundary context
     */
    context: PropTypes.str,
    /**
     * React children
     */
    children: PropTypes.any,
};
