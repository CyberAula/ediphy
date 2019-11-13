import styled from 'styled-components';
import { PRIMARY_BLUE } from "../../../../sass/general/constants";
import { EDModal } from "../../../../sass/general/EDModal";

export const ModalContainer = styled(EDModal).attrs({ className: 'richMarksModal pageModal' })`
  .modal-body{
    .row{
      margin: 5px 0 10px;
      .col-md-2{
        text-align: right;
      }
      textarea{
        height: 120px;
        width: 350px;
        margin-bottom: 15px;
      }
    }
    .control-label {
      color: #444 !important;
    }
  }
  
  .colorPanel.rc-color-picker-panel {
    border-radius: 0%;
    box-shadow: none;
    transform: translate(0px, 0px);

  .rc-color-picker-panel-board-hsv {
    height: 50px;
  }
  .rc-color-picker-panel-inner {
    border-radius: 0px;
    box-shadow: none;
  }
  .rc-color-picker-panel-board-handler {
    border-radius: 0px;
  }
  .rc-color-picker-panel-ribbon {
    border-radius: 0px;
  }
  .rc-color-picker-panel-preview {
    span {
      border-radius: 0px;
    }
    input {
      pointer-events:none;
    }
  }
}
`;

export const TypeSelector = styled.div.attrs({ className: 'typeSelector' })`
  display: flex;
  align-items: center;
  .templateSettingMarks{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-left: 2px;
    height: 34px;
    width: 34px;
    border: 0;
    background-color: transparent;
    color: ${PRIMARY_BLUE};
    padding: 0;
    outline: none;
    transition: 0.2s all ease-in;
    &:active {
      background-color: transparent !important;
      color: ${PRIMARY_BLUE};
      border: none;
      box-shadow: none !important;
    }
    &:hover {
      transform: rotate(90deg);
    }
  }
`;
