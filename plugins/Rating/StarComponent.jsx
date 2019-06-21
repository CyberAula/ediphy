import React from 'react';
/* eslint-disable react/prop-types */

export default class StarComponent extends React.Component {
    render() {
        return (
            <svg className={this.props.className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 51 48">
                <path d="m25,1 6,17h18l-14,11 5,17-15-10-15,10 5-17-14-11h18z"/>
            </svg>
        );
    }
}
/* eslint-enable react/prop-types */
