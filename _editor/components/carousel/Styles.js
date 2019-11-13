import styled from "styled-components";
import { Button } from 'react-bootstrap';
import { BLUE_PRIMARY, MEDDIUM_GREY, DETAIL_GREEN } from '../../../sass/general/constants';

export const PopoverButton = styled(Button)`

margin: 4px;
border: 0;
display: inline-block;
background-color: ${MEDDIUM_GREY} !important;
color: white !important;
text-align: center;
margin-top: 0px !important;
padding: 2px 4px !important;
width: auto !important;
height: auto !important;
border-radius:0;
&:hover {
    background-color: ${BLUE_PRIMARY};
    color: ${DETAIL_GREEN};

}
${props => props.popoverURLChildren && css`
    margin: 0 !important;
    padding: 2px 10px !important;
    flex-shrink: 1;
`}

`
    ;
