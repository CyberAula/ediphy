import React, { useState } from 'react';
import IconButton from "./IconButton";
import { ICONLIST } from "./icons";
import PropTypes from 'prop-types';
import i18n from 'i18next';
import { StyledDiv, StyledTable } from './Styles';
import { PRIMARY_BLUE } from "../../../../sass/general/constants";

const IconPicker = (props) => {

    const [text, setText] = useState("");
    const [more, setMore] = useState(false);

    const handleClick = (selectedIcon) => {
        return props.onChange({ selectedIcon });
    };

    const renderTable = ()=> {
        if(text === "") {
            return ICONLIST.map((icon, index) => {
                return <IconButton handleClick={handleClick} selected={icon === props.text} text={icon}
                    key={index}/>;
            });
        }
        const searchText = text.toLowerCase();
        return ICONLIST.filter(icon => icon.includes(searchText)).map((icon, index) => {
            return <IconButton handleClick={handleClick} selected={icon === props.text} text={icon}
                key={index}/>;
        });

    };

    return (
        <StyledTable style={{ display: "flex", justifyContent: "start", alignItems: "center", flexDirection: "column" }}>
            <div style={{ paddingBottom: "0.8em", width: "100%" }}>
                <input type="text" placeholder={i18n.t("icon_picker.searchbox_preview")} value={text} onChange={e=>setText(e.target.value)} className="input"/>
            </div>
            <br/>
            <div className="table">
                {renderTable()}
                <br/>
                { more === false && text === "" ? <div style={{ backgroundColor: PRIMARY_BLUE, width: "90%", textAlign: "center", borderRadius: 10, margin: "auto" }} onClick={()=>setMore(true)}>Show More</div> : null}
            </div>
        </StyledTable>
    );
};

export default IconPicker;

IconPicker.propTypes = {
    /**
     * Function to handle changes
     */
    onChange: PropTypes.func.isRequired,
};
