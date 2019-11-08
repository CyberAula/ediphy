import styled from 'styled-components';
import {
    ADAMS_ORANGE,
    GREY_INSIDE_PANELS,
    LIGHT_GREY,
    LIGHTEST_GREY, MatIcon,
    PRIMARY_BLUE,
} from "../../../sass/general/constants";
import { Panel } from "react-bootstrap";

export const ToolbarTabs = styled.div.attrs({ className: 'toolbarTabs' })`
  color: ${LIGHTEST_GREY};
  li {
    padding-bottom: 0;
    a {
      border-color: transparent;
      color: ${LIGHTEST_GREY};
      border-radius: 0;
      padding: 10px 12px;
      cursor: pointer;
      &:hover {
        border-color: transparent;
        background-color: transparent;
        color: ${ADAMS_ORANGE};
      }
    }
  }
`;

export const ToolbarTitle = styled.div`
`;

export const Title = styled.div`
    display: ${ props => props.open ? 'inline-block' : 'block' };
    margin-top: ${ props => props.open ? '0px' : '8px' };
    cursor: pointer;
    color: ${LIGHT_GREY};
    * {
        transition: all 0.2s ease-in;
    }
    &:hover {
        color: #fff !important;
    }
    .material-icons {
        padding: 10px;
        &:hover{
            transform: scale(1.2);
        }
    }
`;

export const ToolbarTab = styled.div.attrs({ className: 'toolbarTab' })`
    .panel-group{
        margin-bottom: 5px;
    }
`;

export const Accordion = styled(Panel).attrs({ className: 'panelTab' })`
    border: 0;
    border-radius: 0;
    .toolbarTab {
        color: ${PRIMARY_BLUE};
    }
    .panel-title > a {
        transition: all 0.2 ease-in;
        &:hover, &:active, &:focus {
            border-left: 3px solid ${PRIMARY_BLUE};
            border-radius: 0;
        }
        border-left: 3px solid ${PRIMARY_BLUE};
    }
    a {
        padding: 12px;
        display: block;
        text-decoration: none;
        font-size: 0.9em;
        cursor: pointer;
    }
    a > p{
        padding: 12px;
        display: block;
        text-decoration: none;
        font-size: 14.4px;
        cursor: pointer;
        margin-bottom: 0;
    }
    .panel-body {
        border: 0 !important;
        background-color: ${GREY_INSIDE_PANELS};
        margin-bottom: -6px;
        padding: 16px 24px 20px 24px;
    }
    .panel-heading {
        padding: 0;
        border: 0;
        border-radius: 0;
        color: ${LIGHTEST_GREY};
        background-color: #121212;
        .collapsed{
            border-left: 0px solid transparent !important;
        }
        transition: all 0.2s ease-in;
        &:hover, &:active, &:focus {
            border-left: 3px solid ${PRIMARY_BLUE};
            border-radius: 0;
        }
    }
    .panel-heading:hover{
        border-left: 0;
    }
    .panel-group, .panel {
        margin-bottom: 5px !important;
        border-radius: 0;
        border: 0;
    }
    .rangeInput {
        margin-bottom: 18px;
        margin-top: 10px;
    }
    a.toggle-switch---switch---3EchW {
        display:inline-block;
        opacity: 1 !important;
    }
`;

export const ToolbarIcon = styled(MatIcon)`
    font-size: 16px !important;
    width: 24px;
`;

