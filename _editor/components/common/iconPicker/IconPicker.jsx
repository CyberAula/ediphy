import React, { useState } from 'react';
import IconButton from "./IconButton";
import { ICONLIST } from "./icons";
import PropTypes from 'prop-types';
import i18n from 'i18next';

const IconPicker = (props) => {

    const [text, setText] = useState("");

    const handleClick = (selectedIcon) => {
        return props.onChange({ selectedIcon });
    };

    const renderTable = ()=> {
        const REDUCEDICONLIST = [];
        ICONLIST.forEach((icon)=>{if(icon.includes(text.toLowerCase())) {REDUCEDICONLIST.push(icon);}});
        const searchText = text.toLowerCase();
        const reduced = ICONLIST.filter(icon => icon.includes(searchText)).map(red => <IconButton handleClick={handleClick} text={red}/>);
        return reduced;
    };

    return (
        <React.Fragment>
            <input type="text" placeholder={i18n.t("icon_picker.searchbox_preview")} value={text} onChange={e=>setText(e.target.value)} style={{ borderRadius: 0, padding: "6px", border: "1px", borderStyle: "solid", borderBlockColor: "#ccc" }}/>
            <br/>
            <div style={{ height: "200px", width: "100%", display: 'flex', flexDirection: "row", flexWrap: "wrap", overflowY: "scroll", paddingTop: "1em", alignContent: "flex-start" }}>
                {renderTable()}
            </div>
        </React.Fragment>
    );
};

export default IconPicker;

IconPicker.propTypes = {
    /**
     * Function to handle changes
     */
    onChange: PropTypes.func.isRequired,

};
