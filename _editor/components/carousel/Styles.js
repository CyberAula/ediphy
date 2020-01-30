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

export const FolderContainer = styled.div`
    color: white;
    box-sizing: border-box;
    font-size: 0.9em;
    border: none;
    //padding-left: 4px;
    //padding-right: 4px;
    max-height: 33px;

    .material-icons{
    color: white;
    font-size: 1.2em;
    padding: 4px;
    transition: all 0.25s 0s;
    transform: rotate(0deg);
    }

    &.collapsed {
    i{
        transition: all 0.25s 0s;
        transform: rotate(-90deg);
    }
    }
`;
export const FileContainer = styled.div`
    color: white;
    overflow: hidden;
    font-size: 0.9em;
    max-height: 33px;
    transition: max-height 0.3s ease-in-out;

    &.collapsed {
    max-height: 0;
    padding: 0;
    border: none;
    }
`
    ;

export const ToggleCollapseHandle = styled.button`
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
`
;
