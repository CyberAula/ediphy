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
            state: {
                ...this.props.state,
                undoGroup: {
                    ...this.props.state.undoGroup,
                    past: this.props.state.undoGroup.past[this.props.state.undoGroup.past.length - 1],
                    history: null,
                },
            },
            action: this.props.lastActionDispatched,
            browser: get_browser(),
            plugin: this.props.context === 'plugin' ? this.props.pluginName : null,
        };

        const url = process.env.CRASH_SERVICE;

        if (url) {
            fetch(url, {
                method: 'POST', // or 'PUT'
                body: JSON.stringify(parsedError), // data can be `string` or {object}!
                headers: { 'Content-Type': 'application/json' },
                mode: 'no-cors',
            })
            // eslint-disable-next-line no-console
                .catch(err => console.error('Error:', err));
        }
    }

    getErrorTemplate = (context) => {
        switch (context) {
        case 'navBar':
            return (
                <div className={"errorView"}>
                    <div className={'errorTitle'}>
                        <span style={{ color: '#17CFC8', display: 'flex', alignItems: 'center' }}><i className="material-icons errorIcon" style={{ color: '#17CFC8', marginRight: '1rem' }}>error</i> Something crashed in {context}: see logs for further information</span>
                    </div>
                </div>
            );
        case 'plugin':
            return (
                <div className={"errorView"} style={{ padding: '10px' }}>
                    <div className={'errorTitle'}>
                        <span style={{ color: '#17CFC8', display: 'flex', alignItems: 'center' }}><i className="material-icons errorIcon" style={{ color: '#17CFC8', marginRight: '1rem', marginLeft: '1re' }}>error</i> Something crashed in {this.props.pluginName}: see logs for further information</span>
                    </div>
                </div>
            );
        case 'toolbar':
            return (<div className={"errorView"} style={{ width: '200px', justifyContent: 'flex-end' }}>
                <div className={'errorTitle'} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', color: '#17CFC8' }}>
                    <i className="material-icons errorIcon" style={{ color: '#17CFC8', marginRight: '1rem', marginBottom: '0.5rem', fontSize: '2em' }}>error</i>
                    <p style={{ fontSize: '1.5rem', color: '#17CFC8', textAlign: 'end', marginRight: '1rem' }}>Something crashed in carousel: see logs for further information</p>
                </div>
            </div>);
        case 'carousel':
            return (
                <div className={"errorView"} style={{ justifyContent: 'flex-end' }}>
                    <div className={'errorTitle'} style={{ display: 'flex', flexDirection: 'column', marginLeft: '0.5rem', color: '#17CFC8' }}>
                        <i className="material-icons errorIcon" style={{ color: '#17CFC8', marginRight: '1rem', fontSize: '2em' }}>error</i>
                        <p style={{ fontSize: '1.5rem', color: '#17CFC8' }}>Something crashed in carousel: see logs for further information</p>
                    </div>
                </div>
            );
        default:
            return (<div className={"errorView"}>
                <div className={'errorTitle'}>
                    <span><i className="material-icons errorIcon">error</i> Something went wrong</span>
                </div>
                <p>Please refresh page</p>
            </div>);
        }
    };

    render() {
        return this.state.hasError ? this.getErrorTemplate(this.props.context) : this.props.children;
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
