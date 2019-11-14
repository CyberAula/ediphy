import React from 'react';
import IconButton from "./IconButton";
import { ICONLIST } from "./icons";

class IconPicker extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            icon: "face",
        };
        this.handleClick = this.handleClick.bind(this);
    }
    render() {
        return (
            <React.Fragment>
                <h2>Selector</h2>
                <i className="material-icons">{this.state.icon}</i>
                <div className="table-responsive" style={{ height: "200px" }}>
                    <table className="table">
                        <tbody>
                            {this.renderTable()}
                        </tbody>
                    </table>
                </div>
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
                <tr>
                    <th> <IconButton handleClick={this.handleClick} text={ICONLIST[i]}/></th>
                    <th>{(i + 1) <= ICONLIST.length ? <IconButton handleClick={this.handleClick} text={ICONLIST[i + 1]}/> : null} </th>
                    <th>{(i + 2) <= ICONLIST.length ? <IconButton handleClick={this.handleClick} text={ICONLIST[i + 2]}/> : null} </th>
                    <th>{(i + 3) <= ICONLIST.length ? <IconButton handleClick={this.handleClick} text={ICONLIST[i + 3]}/> : null} </th>
                </tr>);
        }
        return temp;
    }
}

export default IconPicker;
