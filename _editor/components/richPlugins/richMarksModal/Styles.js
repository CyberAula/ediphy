import styled from 'styled-components';
import { PRIMARY_BLUE, PRIMARY_BLUE_DARK } from "../../../../sass/general/constants";
import { EDModal } from "../../../../sass/general/EDModal";
import { FormGroup, ToggleButton, ToggleButtonGroup } from "react-bootstrap";
import { EDRadio } from "../../../../sass/general/EDInputs";

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
export const ConfigSize = styled.div`
@media screen and (-webkit-min-device-pixel-ratio:0) {
  input[type='range'] {
    overflow: hidden;
    -webkit-appearance: none;
    background-color: #f0ede6;
  }
  
  input[type='range']::-webkit-slider-runnable-track {
    height: 10px;
    -webkit-appearance: none;
    color: #13bba4;
    margin-top: -1px;
  }
  
  input[type='range']::-webkit-slider-thumb {
    width: 10px;
    -webkit-appearance: none;
    height: 10px;
    cursor: ew-resize;
    background: #434343;
    box-shadow: -80px 0 0 80px #43e5f7;
  }

}
/** FF*/
input[type="range"]::-moz-range-progress {
background-color: #43e5f7; 
}
input[type="range"]::-moz-range-track {  
background-color: #f0ede6;
}
/* IE*/
input[type="range"]::-ms-fill-lower {
background-color: #43e5f7; 
}
input[type="range"]::-ms-fill-upper {  
background-color: #f0ede6;
}`;

export const MarkTypeTab = styled(ToggleButtonGroup)`
  width: 100%;
  display: flex;
`;

export const TypeTab = styled(ToggleButton)`
  flex: 1;
  border-radius: 0px;
  background-color: white;
  border-color: ${PRIMARY_BLUE};
  box-shadow: none;
  
  &.active, &.focus, &.active.focus{
    box-shadow: none;
    background-color: ${PRIMARY_BLUE};
    border-color: ${PRIMARY_BLUE};
    color: white;
    &:hover, &:focus{
      background-color: ${PRIMARY_BLUE_DARK};
      color: white;
      border-color: ${PRIMARY_BLUE_DARK};
    }
  }
  
  &:hover, &:focus{
    box-shadow: none;
    background-color: ${PRIMARY_BLUE_DARK};
    border-color: ${PRIMARY_BLUE_DARK};
    color: white; 
  }
`;

export const SizeSlider = styled(FormGroup)`
  box-shadow: none;
  input {
  box-shadow: none;
  &:focus{
    box-shadow: none;
    border-color: transparent;
  }
  }
`;

export const LinkToContainer = styled.div`
  ${EDRadio}
`;
