import React from 'react';
import IconButton from "./IconButton";
import { ICONLIST } from "./icons";
import PropTypes from 'prop-types';
import { Col, ControlLabel } from "react-bootstrap";

class IconPicker extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            icon: "room",
        };
        this.handleClick = this.handleClick.bind(this);
    }
    render() {
        return (
            <React.Fragment>
                <Col xs={4} md={2}>
                    <ControlLabel>Selector</ControlLabel>
                </Col>
                <Col xs={8} md={6}>
                    <i className="material-icons">{this.state.icon}</i>
                    <br/>
                    <div className="table-responsive" style={{ height: "200px" }}>
                        <table className="table">
                            <tbody>
                                {this.renderTable()}
                            </tbody>
                        </table>
                    </div>
                </Col>
            </React.Fragment>
        );
    }
    handleClick(text) {
        this.setState({ icon: text });
        this.props.onChange({ text });
    }
    renderTable() {
        let temp = [];
        for(let i = 0; i < ICONLIST.length; i += 4) {
            temp.push(
                <tr key={i}>
                    <td> <IconButton handleClick={this.handleClick} text={ICONLIST[i]}/></td>
                    <td>{(i + 1) <= ICONLIST.length ? <IconButton handleClick={this.handleClick} text={ICONLIST[i + 1]}/> : null} </td>
                    <td>{(i + 2) <= ICONLIST.length ? <IconButton handleClick={this.handleClick} text={ICONLIST[i + 2]}/> : null} </td>
                    <td>{(i + 3) <= ICONLIST.length ? <IconButton handleClick={this.handleClick} text={ICONLIST[i + 3]}/> : null} </td>
                </tr>);
        }
        return temp;
    }
}

export default IconPicker;

IconPicker.PropTypes = {
    /**
     * Function to hancle changes
     */
    onChange: PropTypes.func.isRequired,

};
