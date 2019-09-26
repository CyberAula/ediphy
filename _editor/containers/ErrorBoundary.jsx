import React from 'react';

export default class ErrorBoundary extends React.Component {
    state = { hasError: false };

    componentDidCatch(error, info) {
        this.setState({ hasError: true });
    }

    render() {
        let errorView = (<div className={"errorView"}>
            <span><i className="material-icons errorIcon">error</i> Something went wrong :(</span>
            <p>Please refresh page</p>
        </div>);
        return this.state.hasError ? errorView : this.props.children;
    }
}
