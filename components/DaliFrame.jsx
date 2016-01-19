import React, {Component} from 'react';
import ReactDOM from 'react-dom';

export default class DaliFrame extends Component {

    render() {
        return (
            <div>
                <iframe style={{width: '100%', height: '100%', borderWidth: 0, position: 'absolute'}} src={this.props.src}/>
                <div style={{width: '100%', height: '100%', backgroundColor: 'red', opacity: 0.1, position: 'absolute'}}></div>
            </div>
        );
    }

    componentDidMount() {
        //this.renderFrameContents();
        //console.log("didmount");
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
        //this.renderFrameContents();
        //console.log("didupdate");
    }

    componentWillUnmount() {
        //React.unmountComponentAtNode(ReactDOM.findDOMNode(this).contentDocument.body);
        //console.log("willunmount");
    }
}
