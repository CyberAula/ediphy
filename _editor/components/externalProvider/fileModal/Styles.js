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
        padding: 20px 0;
        min-height: 57vh;
        flex: 1;
        h5 {
          margin: 0;
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
      .ExternalResults{
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
`;
