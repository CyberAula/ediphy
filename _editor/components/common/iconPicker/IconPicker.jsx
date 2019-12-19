import React, { useState } from 'react';
import IconButton from "./IconButton";
import { ICONLIST } from "./icons";
import PropTypes from 'prop-types';

function IconPicker() {

    const [text, setText] = useState("");

    const handleClick = (selectedIcon) => {
        this.props.onChange({ selectedIcon });
    };

    const renderTable = ()=> {
        let temp = [];
        const REDUCEDICONLIST = [];
        ICONLIST.forEach((icon)=>{if(icon.includes(text)) {REDUCEDICONLIST.push(icon);}});
        for(let i = 0; i < ICONLIST.length; i += 5) {
            temp.push(
                <tr key={i}>
                    <td> <IconButton handleClick={handleClick} text={REDUCEDICONLIST[i]}/></td>
                    <td>{(i + 1) <= REDUCEDICONLIST.length ? <IconButton handleClick={handleClick} text={REDUCEDICONLIST[i + 1]}/> : null} </td>
                    <td>{(i + 2) <= REDUCEDICONLIST.length ? <IconButton handleClick={handleClick} text={REDUCEDICONLIST[i + 2]}/> : null} </td>
                    <td>{(i + 3) <= REDUCEDICONLIST.length ? <IconButton handleClick={handleClick} text={REDUCEDICONLIST[i + 3]}/> : null} </td>
                    <td>{(i + 4) <= REDUCEDICONLIST.length ? <IconButton handleClick={handleClick} text={REDUCEDICONLIST[i + 4]}/> : null} </td>
                </tr>);
        }
        return temp;
    };

    return (
        <React.Fragment>
            <input type="text" value={text} onChange={e=>setText(e.target.value)}/>
            <div className="table-responsive " style={{ height: "200px", width: "100%" }}>
                <table className="table">
                    <tbody>
                        {renderTable()}
                    </tbody>
                </table>
            </div>
        </React.Fragment>
    );
}

export default IconPicker;

IconPicker.propTypes = {
    /**
     * Function to handle changes
     */
    onChange: PropTypes.func.isRequired,

};
