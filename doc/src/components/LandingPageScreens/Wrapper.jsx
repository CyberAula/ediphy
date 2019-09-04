import React, { Component } from 'react';
import { Grid } from 'react-bootstrap';
/* eslint-disable react/prop-types */

export default class Main extends Component {
    render() {
        return (
            <div className="view" id={this.props.id} >
                <div className="ext-box">
                    <div className="int-box">
                        <Grid fluid={this.props.fluid}>
                            {this.props.children}
                        </Grid>
                    </div>
                </div>
            </div>
        );
    }
}
/* eslint-enable react/prop-types */
