import React, {Component} from 'react';
import ReactDOM from 'react-dom';

export default class DaliFrame extends Component {

    render() {
        return <iframe style={{width: '100%', height: '100%', borderWidth: 0}} src="../plugins/BasicImage/BasicImage.html"/>;
    }

    componentDidMount() {
        this.renderFrameContents();
    }

    renderFrameContents() {
        var doc = ReactDOM.findDOMNode(this).contentDocument;
        if (doc.readyState === 'complete') {
            var contents = (
                <div>
                    <link type='text/css' rel='stylesheet' href='../plugins/BasicImage/BasicImage.css' />
                    {this.props.children}
                </div>
            );

            //ReactDOM.render(contents, doc.body);
        } else {
            setTimeout(this.renderFrameContents, 0);
        }
    }

    componentDidUpdate() {
        this.renderFrameContents();
    }

    componentWillUnmount() {
        React.unmountComponentAtNode(ReactDOM.findDOMNode(this).contentDocument.body);
    }
}
