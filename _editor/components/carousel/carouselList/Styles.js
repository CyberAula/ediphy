import styled from "styled-components";
import { BACKGROUND_GREY, MEDIUM_GREY } from "../../../../sass/general/constants";

export const CarList = styled.div`
    overflow-y: auto;
    //height: calc(100% - 300px);
    color: ${BACKGROUND_GREY};
    .material-icons{
        padding: 0 12px 0px 12px;
    }
    -webkit-transition: height .25s  ease-in-out;
    -moz-transition: height .25s  ease-in-out;
    -ms-transition: height .25s  ease-in-out;
    -o-transition: height .25s  ease-in-out;
    transition: height .25s  ease-in-out;
    background-color: #444;
    .empty-info{
      margin: 40px;
      text-align: center;
      color: ${MEDIUM_GREY};
      background-color: transparent;
    }
`
    ;
