import React, {Component} from 'react';

export default class DaliTitle extends Component {
    render() {
        let titlesComponents = "";
        this.props.titles.map((text, index) =>{
            titlesComponents += "<h" + (index + 1) + ">" + text + "</h" + (index + 1) + ">";
        });
        return (
            <div style={{marginLeft: 30, paddingTop: 10}} dangerouslySetInnerHTML={{__html: titlesComponents}}>
            </div>

        );
    }
}
