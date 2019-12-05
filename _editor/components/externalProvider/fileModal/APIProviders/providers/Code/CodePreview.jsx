import React from 'react';
import PropTypes from 'prop-types';

export default class CodePreview extends React.Component {
    state = {
        content: "No preview",
    };
    render() {
        return <pre className="codePreview">{this.state.content}</pre>;
    }

    componentDidMount() {
        fetch(this.props.source)
            .then(res=> res.text())
            .then(content=>{
                this.setState({ content });
            });
    }
}
CodePreview.propTypes = {
    /**
     * URL of the file containing the code
     */
    source: PropTypes.string,
};
