import styled from 'styled-components';
import { Radio } from "react-bootstrap";
import {
    ADAMS_ORANGE,
    LIGHT_ORANGE,
    MatIcon,
    PRIMARY_BLUE,
    PRIMARY_BLUE_TRANSPARENT,
} from "../../../../sass/general/constants";
import { EDRadio } from "../../../../sass/general/EDInputs";
import { EDModal } from "../../../../sass/general/EDModal";

export const ModalContainer = styled(EDModal).attrs({ className: 'exportModal' })`
  .spinnerFloat {
    position: absolute;
    right: 20%;
    top: 13%;
    width: 75px;
  }
  .radioExportScorm {
    display:block !important;
    margin-left: 15px;
  }
  #previewTitle {
    i {
      font-size: 20px;
    }
  }

  .panel .panel-default{
  }

  .panel-group .panel + .panel {
    margin-top: 0 !important;
  }

  .panel-default {
    box-shadow: none;
    border-color: transparent !important;
    border-bottom: 1px solid lightgrey;
  }

  .panel-body{
    border-top: none !important;
  }

  .panel-group:first-child {
    border-top: 1px solid lightgrey;
  }

  .panel-title a{
    display: block;
    cursor: pointer;
    font-weight: bold;
    text-decoration: none;
    background-color: white;
    color: ${PRIMARY_BLUE};
    padding-left: 15px;
    padding-right: 15px;
    padding-bottom: 10px;
    padding-top: 10px;
  }

  .panel-title a .expandArrow {
    transition: all 0.25s 0s;
    transform: rotate(180deg);
  }

  .panel-title a:hover {
    display: block;
    cursor: pointer;
    text-decoration: none;
  }

  .panel-title a:active {
    display: block;
    cursor: pointer;
    text-decoration: none;
    color: ${PRIMARY_BLUE};
    font-weight: bold;
  }

  .panel-title .collapsed .expandArrow {
    transform: rotate(0);
  }

  .panel-title a:active:hover {
    display: block;
    cursor: pointer;
    text-decoration: none;
    color: ${PRIMARY_BLUE};
    font-weight: bold;
  }

  .panel-title .collapsed {
    font-weight: normal;
    background-color: white;
    color: ${PRIMARY_BLUE};
  }

  .panel-group .panel {
    border-bottom: 1px solid lightgrey !important;
  }

  .panel-default > .panel-heading {
    padding: 0!important;
  }

  .panel-default > .panel-heading:hover {
    background-color: #ececec;
  }

  .expandArrow{
    float: right;
  }
   .modal-body {
    font-size: 1em;
     padding-bottom: 0px !important;
    .control-label {
      font-size: 1.2em !important;
    }
  }

  .betaSub {
    color: ${PRIMARY_BLUE};
  }

  .slideRadio {
    margin-left: 25px;
    margin-right: 5px;
  }
`;

export const ExportRadio = styled(Radio)`
${EDRadio}
`;

export const Explanation = styled.div.attrs({ className: 'explanation' })`
     color: #999;
    .selfContained{
      margin: 20px 0;
      display: flex;
    }
    .forcePageBreak{
      margin: 20px 0;
      display: flex;
      align-items: center;
      justify-content: flex-start;
    }
    .pageTemplates{
      display: flex;
      justify-content: space-around;
      align-items: center;
      .template_item{
        cursor: pointer;
      }
    } 
`;

export const PageTemplates = styled.div.attrs({ className: 'pageTemplates' })`
      display: flex;
      justify-content: space-around;
      align-items: center;
`;

export const TemplateItem = styled.div.attrs({ className: "templateItem" })`
      position: relative;
      cursor: pointer;
`;

export const PrintSettingsExplanation = styled.ul`
    li {
        color: ${PRIMARY_BLUE} !important;
        font-weight: bold;
    }
`;

export const PrintExplanation = styled.div.attrs({ className: 'printExplanation' })`
    padding: 8px 10px;
    background-color: ${PRIMARY_BLUE_TRANSPARENT};
    color: ${PRIMARY_BLUE};
    border: 1px solid ${PRIMARY_BLUE};
    color: #1d1d1d;
    .print-explanation-body-sub{
      color: #607780;
    }
`;

export const PrintTitle = styled.div.attrs({ className: 'printExplanationTitle' })`
    display: flex;
    align-items: center;
    font-weight: bold;
    color: ${PRIMARY_BLUE};
`;

export const PrintBody = styled.div.attrs({ className: 'printExplanationBody' })`
    color: ${PRIMARY_BLUE};
`;

export const BrowserExplanation = styled.div.attrs({ className: 'browserExplanation' })`
    margin-top: 8px;
    padding: 8px 10px;
    background-color: ${LIGHT_ORANGE};
    color: ${ADAMS_ORANGE};
    border: 1px solid ${ADAMS_ORANGE};
`;

export const BrowserTitle = styled.div.attrs({ className: 'browserTitle' })`
    display: flex;
    align-items: center;
    font-weight: bold;
    color: ${ADAMS_ORANGE};
`;

export const InfoIcon = styled(MatIcon)`
    margin-right: 7px;
`;
