import React from 'react';
import IconButton from "./IconButton";
import { ICONLIST } from "./icons";
import PropTypes from 'prop-types';

class IconPicker extends React.Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }
    render() {
        return (

            <div className="table-responsive " style={{ height: "200px", width: "40%" }}>
                <table className="table">
                    <tbody>
                        {this.renderTable()}
                    </tbody>
                </table>
            </div>

        );
    }
    handleClick(text) {
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

IconPicker.propTypes = {
    /**
     * Function to handle changes
     */
    onChange: PropTypes.func.isRequired,

};
