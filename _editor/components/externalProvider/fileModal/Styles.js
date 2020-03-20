import styled from 'styled-components';
import { EDModal } from "../../../../sass/general/EDModal";
import {
    ADAMS_ORANGE,
    DARKEST_GREY,
    DETAIL_GREEN,
    DETAIL_GREEN_TRANSPARENT,
    GREY, LIGHT_ORANGE, LIGHT_RED, LIGHT_RED_TRANSPARENT,
    LIGHTEST_GREY,
    PRIMARY_BLUE, PRIMARY_BLUE_TRANSPARENT,
} from "../../../../sass/general/constants";
import { EDRadio } from "../../../../sass/general/EDInputs";
import { Form } from "react-bootstrap";

export const FileModalContainer = styled(EDModal)`
  .modal-footer {
    height: 62px;
    display: flex;
    align-items: center;
    justify-content: flex-end;

    .fileModalButtonsFooter{
      width: 50%;
      display: flex;
      flex-direction: row;
      justify-content: flex-end;
    }
  }
  .modal-dialog {
  margin-top: 30px;
  .codePreview {
    overflow: auto;
    max-height: 300px;
    }
  }
  .modal-body {
    padding: 0;
    .row-eq-height {
      display: -webkit-box;
      display: -webkit-flex;
      display: -ms-flexbox;
      display:         flex;
    }
    #menuColumn {
      width: 172px;
      padding: 0;
      border-right: 1px solid grey;
      flex-shrink: 0;
      background-color: ${LIGHTEST_GREY};
      overflow: auto;
      .list-group {
        margin: 0;
        .listGroupItem {
          background-color: transparent;
          border-radius: 0;
          border: none;
          font-size: 1.05em;
          padding: 15px;
          i {
            font-size: 1.1em;
            vertical-align: middle;
            margin-right: 10px;
            color: ${DARKEST_GREY};
          }
          .fileMenuIcon {
            width: auto;
            height: 20px;
            -webkit-filter: grayscale(100%); /* Safari 6.0 - 9.0 */
            filter: grayscale(100%);
          }
          .fileMenuName {
            width:100%;
            text-align: left;
          }
          &.active {
            background-color: #ddd;
            color: ${GREY};
            font-weight: bold;
          }
        }
      }
    }
    #contentColumn {
      padding: 0;
      flex-grow: 1;
      align-self: stretch;
      max-width: calc(100% - 172px);
      display: flex;
      flex-direction: column;

      .contentComponent{
        padding: 20px 0 0 0;
        min-height: 57vh;
        flex: 1;
        h5 {
          padding: 0 20px;
          color: ${PRIMARY_BLUE};
          font-size: 16px;
          .searchInputTopBar {
            width:60%;
            float: right;
          }
          .fileMenuIcon {
            width: auto;
            height: 24px;
          }
          .myResourcesFormGroup {
            display: flex;
            flex-flow: nowrap row;
            justify-content: flex-end;
            align-items: center;
            width: 100%;
            margin-bottom: -15px;
            label, input {
              margin: 0.6em 0px;
            }
            label {
              margin-right: 5px;
              color: #777;
              font-weight: normal;
              font-size: 0.85em;

            }
           }
        }
        hr{ margin: 20px 0 0 0; }
      }
      .uploadComponent {
        padding: 20px;
        hr{     margin: 25px -20px; }
        h5{ padding: 0}
        .fileInput{
          &.dragging {
            .fileDrag {
              //background-color: white;
              box-shadow: inset 0px 0px 12px #ccc;
            }
          }
        }
        .fileDrag {
          margin: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 350px;

        }
        .previewImg {
          width:100%;
          height: auto;
        }
        .preview {
          width:100%;
          height: auto;
          min-height: 200px;
          overflow:hidden;
          padding: 10px;
          text-align: center;
          border-width: 3px;
          background-color: #ddd;
          border-color: transparent;
          background-position: center;
          background-size: cover;
          transition: all 0.2s ease;
          i {
            vertical-align: middle;
            line-height: 200px;
            font-size: 40px;
          }
        }
        .uploadModalMsg {
          padding: 12px;
          margin: 12px 2px;
          display: flex;
          i {
            vertical-align: middle;
            margin-right: 10px;
          }
          &#errorMsg {
            color: ${LIGHT_RED};
            border: 1px solid ${LIGHT_RED};
            background-color: ${LIGHT_RED_TRANSPARENT};
          }
          &#uploadedMsg{
            color: ${DETAIL_GREEN};
            border: 1px solid ${DETAIL_GREEN};
            background-color: ${DETAIL_GREEN_TRANSPARENT};
          }
          &#warningMsg{
            color: ${ADAMS_ORANGE};
            border: 1px solid ${ADAMS_ORANGE};
            background-color: ${LIGHT_ORANGE};
          }
        }
        #spinnerFloatContainer {
          text-align: center;
          .spinnerFloat {
            margin-top: 10px;
            width: 75px;
          }
        }
      }
      .myFilesComponent{
        padding: 20px;
        //max-height: 458px;
        overflow: auto;
        hr{     margin: 25px -20px; }
        h5{ padding: 0}
        .filters{
          display: flex;
          margin-top: -20px;
          .form-group{
            padding: 15px 5px 0;
            width: 100%;
          }
        }
      }
      #fileNameTitle {
        color: #555;
        font-size: 16px;
        font-weight: bold;
        .btn {
          margin: 2px;
          i {
            font-size: 1.4em;
            vertical-align: middle;
          }
        }
      }
      #serverMsg, .empty {
        width: 100%;
        text-align: center;
        background-color: ${PRIMARY_BLUE_TRANSPARENT};
        padding: 20px;
        color: ${PRIMARY_BLUE};
        font-weight: bold;
      }
      .myFile {
        &.hidden {
          display: none;
        }
        .deleteButton, .downloadButton, .previewFileButton {
          background-color: ${PRIMARY_BLUE};
          color: white;
          position: absolute;
          padding: 2px 5px;
          border: none;
          i{ font-size: 1.4em; line-height: 1em; }
        }
        .deleteButton{ top: 11px; right: 11px; }
        .downloadButton{ top: 11px; right: 46px; }
        .previewFileButton{ top: 11px; right: 81px; }
        height: 160px;
        transition: all 0.2s ease;
        &:hover {
          transform: scale(0.95);
        }
        .myFileContent {
          width:100%;
          height: 70%;
          overflow: hidden;
          padding: 10px;
          text-align: center;
          border-width: 3px;
          background-color: #ddd;
          border-color: transparent;
          background-position: center;
          background-size: cover;
          &.active {
            border-color: ${PRIMARY_BLUE} !important;
          }
          i {
            font-size: 40px;
          }
        }
        .ellipsis {
          width:100%;
          display:block;
          height: 30%;
          overflow: hidden; /* 1 */
          white-space: nowrap; /* 2 */
          text-overflow: ellipsis; /* 3 */
          text-align: center;
          font-size: 13px;
          vertical-align: middle;
          line-height: calc(130px * 0.3);
        }
        padding:5px;
      }
      .myFilesRow { clear:both; }
      .form-group .Select {
        border: 1px solid #ccc;
        &:focus, .is-focused {
          border-color: #66afe9;
          outline: 0;
          -moz-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 8px rgba(102, 175, 233, 0.6);
          -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 8px rgba(102, 175, 233, 0.6);
          box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 8px rgba(102, 175, 233, 0.6);

        }
        .Select-control {
          border: none;
        }
      }
      .form-group #filterInput {
        height: 38px;
      }
      hr.fileModalFooter {
        margin: 0px;
      }
      .inputSearch {
        cursor: pointer;
      }
      .hiddenButton {
        display: none;
      }
      .footerFile {
        width: 50%;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        float:left;
        text-align: left;
        padding-right: 1em;
        i {
          vertical-align: middle;
        }
      }
      #sideBar {
        background-color: white;
        height: 100%;
        width: 0;
        position: absolute;
        right: 0;
        transition: width 0.5s ease;
        top: 0;
        z-index: 9999;
        #drawerContent {
          padding: 20px;
          width: calc(100% - 30px);
          display: inline-block;
          margin-left: 40px;
          height: 100%;
          .import_file_buttons {
            display: flex;
            justify-content: space-between;
            align-items: center;
            text-align: right;
            margin:5px;
            button {
              margin: 5px;
            }
            .selectAll{
              margin-left: 20px;
              label{
                margin-left: 5px;
              }
            }
            .moodleButtons{
              display: flex;
            }
            .moodleXmlFeedback {
              color: ${PRIMARY_BLUE};
            }
          }
        }
        #wrapper {
          height: 100%;
          overflow-y:auto;
          overflow-x: hidden;
        }
        &.showBar {
          width: 100%;
          overflow: hidden;
        }
        #sideArrow {
          height: 100%;
          width: 30px;
          background-color: grey;
          position:absolute;
          color: white;
          display:inline-block;
          button {
            cursor: pointer;
            background-color: transparent;
            margin:auto;
            border: none;
            box-shadow: none;
            vertical-align: middle;
            text-align: center;
            display: inline-block;
            height: 100%;
            width: 100%;
          }
        }
      }
    }
  }

  .selectD:disabled, .selectD.is-disabled{
      -webkit-appearance: none;
      -moz-appearance: none;
      text-indent: 1px;
      text-overflow: '';
    .Select-value {
      background: #ddd;
      cursor: not-allowed;
    }
    .Select-arrow-zone {
      display: none;
    }
  }
  
  .previewButton {
  height: 30px;
  width: 33px;
  padding: 3px 8px;
  font-size: 18px;
  background-color: ${PRIMARY_BLUE};
  border: none;
  color: white !important;
  i {
    font-size: 18px;
  }
  &:hover, &:active, &:focus {
    background-color: ${PRIMARY_BLUE} !important;
    color: white !important;
    outline: none !important;
    i {
      transform: scale(1.3);
    }

    -webkit-box-shadow: none;
    box-shadow: none;
  }
}
`;

export const PDFDialog = styled.div.attrs({ className: 'pdfFileDialog' })`
  ${EDRadio}
    h2{
      font-size: 1.1em;
      font-weight: bold;
      margin: 0;
    }
    .fileLoaded{
      margin-bottom: 10px;
    }
    .form-group{
      .radio-inline{
        width: 100%;
        margin: 8px 0;

      }
    }
`;

export const MoodleDialog = styled.div.attrs({ className: 'moodleDialog' })`
  height: 100%;
  font-size: 0.85em;
  form {
    height: 100%;
    .moodleTable{
      height: 100%;
      & > .row {
        height: calc(100% - 4em);

        & > div {
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: space-between;

          .container{
            width: 100%;
          }
        }
      }
      .icon-user {
        //@extend .fa;
        //@extend .fa-user;
      }

      .d3Options, .d3Axes {
        padding-left: 2.5em;
      }

      .form-group div p {
        font-weight: bold;
      }

      .svgContainer {
        padding: 0px;
        position: fixed;
        right: 2.7em;
        z-index: 10;
      }

      .tableContainer > .container {
        width: 100% !important
      }

      .tableContainer > .container > .row > div > div {
        text-align: left;
      }

      .table {
        margin-bottom: 1.2em;
        border-collapse: collapse;
      }

      .form-control {
        height: 2.2em;
        padding: 0.4em 0.9em;
        font-size: 1em;
      }

      .container {
        padding-right: 1em;
        padding-left: 0em;
        margin-right: auto;
        margin-left: auto;
      }

      .pagination {
        margin: 1.2em 0;
      }

      .pagination > .active > a, .pagination > .active > a:hover, .pagination > .active > a:focus, .pagination > .active > span, .pagination > .active > span:hover, .pagination > .active > span:focus {
        background-color: ${PRIMARY_BLUE};
        color: white;
      }

      .pagination > li > span {
        color: ${PRIMARY_BLUE};
        border-color: #ddd;
      }

      .pagination > li > a {
        color: ${PRIMARY_BLUE};
      }

      .pagination > .active > a, .pagination > .active > a:hover, .pagination > .active > a:focus, .pagination > .active > span, .pagination > .active > span:hover, .pagination > .active > span:focus {
        border-color: #ddd;
      }

      .pagination li {
        margin-left: 0px;
        width: 2.5em;
        svg {
          width: 1em;
          height: 1em;
          vertical-align: middle;
          fill: grey;
        }
      }

      .pluginconfig .modal-body {
        overflow-y: auto;
        h4 {
          margin-bottom: 1em !important;
        }
        .options-table {
          padding: 1.2em !important;
          .mycb {
            margin: 0.3em;
          }
        }

      }

      .wholebox .tableContainer * {
        pointer-events: none !important;
      }

      .form-horizontal .checkbox.mycb {
        min-height: 1.1em;
        padding-top: 0px;
        vertical-align: middle;
      }

      .chartContainer * {
        cursor: not-allowed;
      }

      #previewOverlay {
        width: 100%;
        height: 100%;
        position: absolute;
        cursor: not-allowed;
        top: 0;
        left: 0;
        //pointer-events: none;
      }

      .pagination > li > a, .pagination > li > span {
        position: relative;
        float: left;
        padding: 0.4em 0.9em;
        margin-left: -0.1em;
      }

      @media (min-width: 576px) {
        #thirdCol {
          padding-left: 1.5em;
          padding-right: 1.5em;

        }
      }

      .table {
        svg {
          width: 1em;
          height: 1em;
          vertical-align: middle;
        }
      }

      .table > thead > tr > th, .table > thead > tr > td, .table > tbody > tr > th, .table > tbody > tr > td, .table > tfoot > tr > th, .table > tfoot > tr > td {
        padding: 0.4em;
        line-height: 1.42857em;
        vertical-align: top;
        border-top: 0.07em solid #ddd;
        text-overflow: ellipsis;
      }

      .table > tbody > tr > td:first-child {
        text-align: center;
        width: 5%;
        line-height: 1.5em;
        max-height: 1.5em;

      }

      .table > tbody > tr > td:nth-child(2) {
        width: 80%;
        line-height: 1.5em;
        max-height: 1.5em;
        text-overflow: ellipsis;
      }

      .col-xs-1, .col-sm-1, .col-md-1, .col-lg-1, .col-xs-2, .col-sm-2, .col-md-2, .col-lg-2, .col-xs-3, .col-sm-3, .col-md-3, .col-lg-3, .col-xs-4, .col-sm-4, .col-md-4, .col-lg-4, .col-xs-5, .col-sm-5, .col-md-5, .col-lg-5, .col-xs-6, .col-sm-6, .col-md-6, .col-lg-6, .col-xs-7, .col-sm-7, .col-md-7, .col-lg-7, .col-xs-8, .col-sm-8, .col-md-8, .col-lg-8, .col-xs-9, .col-sm-9, .col-md-9, .col-lg-9, .col-xs-10, .col-sm-10, .col-md-10, .col-lg-10, .col-xs-11, .col-sm-11, .col-md-11, .col-lg-11, .col-xs-12, .col-sm-12, .col-md-12, .col-lg-12 {
        position: relative;
        min-height: 1px;
        padding-right: 1em;
        padding-left: 1em;
      }

      .row {
        margin-right: -1em;
        margin-left: -1em;
      }
    }
  }
`;

export const ExternalResultsContainer = styled(Form)`
  height: 57vh;
  padding: 0 20px;
  overflow: auto;
`;

export const ExternalResultsModal = styled.div.attrs({ className: 'externalResults' })`
  height: 57vh;
  overflow-y: auto;
  padding: 0 20px;
`;

export const AudioGroupFlex = styled.div`
  display: flex;
`;

export const ExternalResults = styled.div.attrs({ className: 'externalResults' })`
        min-height: 44vh;
        overflow-y: auto;
        max-height: 390px;
        margin-top: -10px;
        margin-bottom: -20px;
        padding: 0 20px;
        .attribution {
          float: left;
          position: absolute;
          margin: -5px;
          width: 188px;
        }
        .control-label{
          width: 100%;
          text-align: right;
          margin: 0;
        }
        .polyInfo {
          flex: 1;
        }
        .videoItem, .audioItem{
          display: flex;
          background-color: transparent;
          flex-flow: nowrap row;
          justify-content: space-between;
          align-items: flex-start;
          padding: 5px;
          border: 2px solid rgb(23, 207, 200);
          .videoGroupFlex {
            display: flex;
            flex-flow: nowrap row;
            justify-content: flex-start;
            align-items: flex-start;
          }
          .youtubeVideo{
            margin-right: 10px;
            width: 120px;
            height: 95px;
          }
          .vishSearchIcon {
            line-height: 111px;
            text-align: center;
            background-color: #ddd;
            i {
              font-size:  32px;
            }
          }
          .videoInfo{
            .lightFont{
              color: #888;
              font-weight: lighter;
              &.overflowHidden {
                text-overflow: ellipsis;
                overflow: hidden;
                word-break: break-word;
                word-wrap: no-wrap;
                max-width: 100%;
              }
            }
          }
          .soundCloudSong{
            margin-right: 10px;
            width: 100px;
            height: 100px;
          }
          .polyObj{
            margin-right: 10px;
            width: 100px;
            height: 75px;
          }
        }
`;
