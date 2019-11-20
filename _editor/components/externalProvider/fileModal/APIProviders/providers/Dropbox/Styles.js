import styled from 'styled-components';
import {
    ADAMS_ORANGE,
    DETAIL_GREEN,
    DETAIL_GREEN_TRANSPARENT,
    LIGHT_RED,
    LIGHT_RED_TRANSPARENT,
} from "../../../../../../../sass/general/constants";
import { ExternalResults } from "../../../Styles";

export const DropboxResults = styled(ExternalResults)`
  height: 100%;
  display: flex;
   >div{
    display: flex;
    flex: 1;
  }

  #fileNameTitle {
    height: 68px;
  }

  iframe {
    border: 1px solid grey;
    margin-right: 10px;
    width: 100%;
    flex: 1;
    height: 100%;
  }
`;

export const DropboxModal = styled.div.attrs({ className: 'dropbox-modal' })`
    width: 100%;
    display: flex;
    flex-direction: row;
    .left-side {
      width: 50%;
      padding: 15px 10px;
      flex: 1;
      display: flex;
      justify-content: flex-start;
      align-items: self-start;
    }
    .right-side {
      width: 50%;
      display: flex;
      flex-direction: column;
      margin-top: 20px;
      margin-bottom: 20px;
      padding-left: 15px;
      .fileNameTitle{
        align-self: flex-start;
        color: #555;
        font-size: 16px;
        font-weight: bold;
      }
      #spinnerFloatContainer{
        display: flex;
        justify-content: space-around;
        align-items: center;
      }
      .dropbox-button{
        padding: 0;
        margin-bottom: 10px;
        text-align: left;
      }
    }
`;

export const DropboxContainer = styled.div.attrs({ className: 'dropbox-container' })`
    display: flex;
    flex: 1;
  .dropbox-click-upload{
    display: flex;
    align-items: center;
    flex: 1;

    .dropbox-button{
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 100%;


    }
  }
`;
export const InfoMessages = styled.div.attrs({ className: 'info-messages' })`
        width: 100%;
        .spinnerFloat{
          width: 10%;
        }
        .uploadModalMsg {
          padding: 12px;
          margin: 10px 0px;
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
            background-color: ${ADAMS_ORANGE};
          }
        }
`;
