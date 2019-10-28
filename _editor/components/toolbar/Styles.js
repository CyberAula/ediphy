import styled from 'styled-components';
import { ADAMS_GREEN, DARKEST_GREY } from "../../../sass/general/constants";

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
    id: 'toolbarFlap', className: 'pestan',
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

export const Tools = styled.div.attrs({ id: 'tools' })`
  width: ${ props => props.open ? '250px' : '40px' };
  height: 100%;
  background-color: $darkest;
  display: inline-block;
  vertical-align: baseline;
  overflow-x: hidden;
  overflow-y: auto;

  .form-group {
    margin: 10px 0;
  }
  /* Input text */
  .form-control {
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
    box-shadow: none;
    border-radius: 0;
    height:auto;
    border: 0;
    padding: 10px 12px;
    background-color: $darkinput;
    color: black;
    &:active, &:focus {
      border-color: orange;
    }
  }

  input[type="checkbox"] {
    padding: 0 !important;
    margin-left: 0;
    position: relative;
    display: inline-block;
    background-color: white;
    line-height: 5px;
    margin-right: 10px;
    height: 15px;
  }

  label, .label {
    margin: 0 !important;
    padding: 0 0 5px 0 !important;
    font-size: inherit;
    font-weight: 500;
  }
  .control-label{
    margin: 8px 0 !important;
  }
  .radio {
    margin-left: 25px;
  }
  .toolbarButton {
    border-radius: 0;
    background-color: $blueprimary;
    color: white;
    border: 0;
    width: 100%;
    margin: 10px 0;

    /*Edit text button when CKEditor is active */
    &.textediting {
      background-color: darken($blueprimary,20%);
    }
    &:hover {
      background-color: darken($blueprimary,20%);
    }
  }

  .font-picker-container{
    .dropdown-button{
      background-color: white;
    }
    button{
      //background-color: red;
      background-color: #fcfcfc;
      &:hover{
        background-color: $blueprimarytransparent;
      }
    }
    .active-font{
      background-color: #dddddd;
    }
  }

  .theme-picker-container{
    .owl-nav{
      display: flex;
      flex-direction: row;
      button{
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
  }
`;
