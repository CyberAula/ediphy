import React from 'React';
export default class Star extends React.Component {
    render() {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" width="255" height="240" viewBox="0 0 51 48">
                <path fill="none" stroke={this.props.stroke || '#000'} d="m25,1 6,17h18l-14,11 5,17-15-10-15,10 5-17-14-11h18z"/>
            </svg>
        );
    }
}
