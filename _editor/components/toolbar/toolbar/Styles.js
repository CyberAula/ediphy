import styled from 'styled-components';
import {
    ADAMS_GREEN,
    DARKEST_GREY,
    LIGHT_GREY,
    MatIcon,
    PRIMARY_BLUE,
} from "../../../../sass/general/constants";
import { EDCheckbox, EDRadio, EDRange } from "../../../../sass/general/EDInputs";

export const Wrapper = styled.div.attrs({
    id: 'wrap', className: 'wrapper',
})`
  transition: top 0.3s ease-in;
  margin: 0;
  position: fixed;
  bottom: 0;
  right: 0px;
  top: ${ props => props.top ?? '0px' };
`;

export const Flap = styled.div.attrs({
    id: 'toolbarFlap',
})`
  border-width: 8px;
  border-style: solid;
  text-align: center;
  display: inline-block;
  position: absolute;
  top: 24px;
  right: 100%;
  border-color: transparent;
  border-right-color: ${DARKEST_GREY};
  color: ${ADAMS_GREEN};
  z-index: 1000;
  cursor: pointer;
`;

export const ToolbarHeader = styled.div`
    display: block;
    cursor: pointer;
    color: ${LIGHT_GREY};
`;

export const TitleText = styled.span`
    display: ${ props => props.open ? 'block' : 'none' };
    padding: 8px;
`;

export const PluginTitle = styled.div`
    display: ${ props => props.open ? 'block' : 'none' };
    margin: -8px 6px 8px;
    color: ${ PRIMARY_BLUE };
    font-weight: 500;
`;

export const Wheel = styled(MatIcon)`
    padding: 10px;
    float: left;
    font-size: 20px;
    margin-top: 8px;
    transition: all 0.2s ease-in;
    &:hover{
        transform: rotate(180deg);
    }
`;

export const Tools = styled.div.attrs({ className: 'tools' })`
  width: ${ props => props.open ? '250px' : '40px' };
  transition: width 0.3s ease-in;
  height: 100%;
  background-color: ${DARKEST_GREY};
  display: inline-block;
  vertical-align: baseline;
  overflow-x: hidden;
  overflow-y: auto;

  .form-group {
    margin: 10px 0;
  }
  .form-control {
    box-shadow: none;
    border-radius: 0;
    height:auto;
    border: 0;
    padding: 10px 12px;
    background-color: white;
    color: black;
    &:active, &:focus {
      border-color: orange;
    }
  }
  label, .label {
    margin: 0 !important;
    padding: 0 0 0 0 !important;
    font-size: inherit;
    font-weight: 500;
  }
  .control-label{
    margin: 8px 0 !important;
  }
  .radio {
    margin-left: 25px;
  }
  .advancedPopover popover.bottom > .arrow:after {
    border-bottom-color: #2c2c2c;
  }
  .popover.bottom > .arrow::after {
      border-bottom-color: inherit;
  }
  ${EDCheckbox}
  ${EDRange}
  ${EDRadio}
`;

export const InsideTools = styled.div`
    display:${ props => props.open ? 'block' : 'none' };
    width: 250px;
    transition: width 0.3s ease-in;
    border-left: 2px solid ${DARKEST_GREY};
    border-right: 2px solid ${DARKEST_GREY};
    .btn-group, .pluginToolbarMainButton {
      background-color: ${DARKEST_GREY};
      border: 0;
      color: white;
      font-weight: lighter !important;
    }
`;
