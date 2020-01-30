import styled from "styled-components";
import { BACKGROUND_GREY, MEDIUM_GREY, DARKEST_GREY } from "../../../../sass/general/constants";

export const CarList = styled.div`
    overflow-y: auto;
    //height: calc(100% - 300px);
    color: ${BACKGROUND_GREY};
    .material-icons{
        padding: 0 12px 0px 12px;
    }
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

export const WrapperCarousel = styled.div`
    background-color: ${DARKEST_GREY};
    margin: 0;
    //padding: 8px 0px 4px 0px;
    width: 100%;
    height: 100%;
    overflow: hidden;
    .material-icons {
        font-size: 1em;
        vertical-align: middle;
        margin: 0;
    }
    .editorCarousel {
        .editIndexTitleIcon {
            font-size: 1em;
            padding: 4px;
        }
    }
    .toolbarHide + .courseTitleCarousel {
        display: none;
        visibility: hidden;
    }
`
    ;

export const ContainedViewsListContainer = styled.div`
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
