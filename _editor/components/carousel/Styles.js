import styled from "styled-components";
import { Button } from 'react-bootstrap';
import { PRIMARY_BLUE, MEDIUM_GREY, DETAIL_GREEN } from '../../../sass/general/constants';

export const PopoverButton = styled(Button)`

margin: 4px;
border: 0;
display: inline-block;
background-color: ${MEDIUM_GREY} !important;
color: white !important;
text-align: center;
margin-top: 0px !important;
padding: 2px 4px !important;
width: auto !important;
height: auto !important;
border-radius:0;
&:hover {
    background-color: ${PRIMARY_BLUE};
    color: ${DETAIL_GREEN};

}
${props => props.popoverURLChildren && css`
    margin: 0 !important;
    padding: 2px 10px !important;
    flex-shrink: 1;
`}

`;

export const CarouselContainer = styled.div`
    box-sizing: border-box;
    background-color: #444;
    width: 100%;
    color: white;
    display: flex;
    flex-direction: row;
    border-bottom: 1px solid black;

    &.collapsed{
    border: none;

    &.isfolder{
        border-bottom: 1px solid black;
    }
    }

    &.selected {
    background-color: #222;
    }

    .body {
    padding: 0px 10px;
    cursor: move;
    }


    &.mute {
    .body {
        opacity: .3;
    }
    }
`
    ;
